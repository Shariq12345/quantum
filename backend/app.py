import io
import requests
import os
from flask import Flask, jsonify, request # type: ignore
from flask_cors import CORS
import numpy as np
import pandas as pd
import logging
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import load_model
import joblib
from ta import add_all_ta_features
import traceback
from polygon import RESTClient

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Ensure models directory exists
MODEL_DIR = 'models'
if not os.path.exists(MODEL_DIR):
    os.makedirs(MODEL_DIR)

try:
    # Load the trained model and scalers
    logger.info("Loading model and scalers...")
    model = load_model(os.path.join(MODEL_DIR, 'final_model.h5'))
    price_scaler = joblib.load(os.path.join(MODEL_DIR, 'price_scaler.save'))
    indicator_scaler = joblib.load(os.path.join(MODEL_DIR, 'indicator_scaler.save'))
    logger.info("Model and scalers loaded successfully")
except Exception as e:
    logger.error(f"Error loading model or scalers: {str(e)}")
    logger.error(traceback.format_exc())
    raise


client = RESTClient(api_key="jCQvtKFC39SWJprdqxyiXFpac9UHB9K1")

def fetch_stock_data(symbol):
    try:
        # Get the most recent trading day
        to_date = pd.Timestamp.now().strftime('%Y-%m-%d')
        from_date = (pd.Timestamp.now() - pd.Timedelta(days=365)).strftime('%Y-%m-%d')
        
        # Fetch data from Polygon
        aggs = client.get_aggs(
            ticker=symbol,
            multiplier=1,
            timespan="day",
            from_=from_date,
            to=to_date
        )
        
        # Convert to DataFrame
        df = pd.DataFrame([{
            'timestamp': agg.timestamp,
            'open': agg.open,
            'high': agg.high,
            'low': agg.low,
            'close': agg.close,
            'volume': agg.volume
        } for agg in aggs])
        
        # Convert timestamp
        df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
        df = df.sort_values('timestamp')
        
        return df
        
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None

def add_technical_indicators(data):
    logger.info("Adding technical indicators")
    try:
        df = data.copy()
        
        # Add all technical indicators
        df = add_all_ta_features(
            df, open="open", high="high", low="low", 
            close="close", volume="volume", fillna=True
        )
        
        # Select relevant features
        selected_features = [
            'open', 'high', 'low', 'close', 
            'trend_sma_fast', 
            'trend_sma_slow', 
            'trend_macd',  
            'trend_macd_signal', 
            'trend_macd_diff',  # MACD Histogram
            'momentum_rsi', 
            'momentum_stoch', 
            'momentum_stoch_signal',  # Stochastic %D
            'momentum_tsi',  # True Strength Index
            'momentum_uo',  # Ultimate Oscillator
            'volatility_atr',  # Average True Range
            'volatility_bbm', 
            'volatility_bbh', 
            'volatility_bbl', 
            'volume_adi',  # Accumulation/Distribution Index
            'volume_obv',  # On-Balance Volume
            'volume_vwap',  # Volume Weighted Average Price
            'volume_mfi',  # Money Flow Index
            'volume_em',  # Ease of Movement
            'volume_sma_em'  # SMA of Ease of Movement
        ]
        
        result = df[selected_features].copy()
        logger.info("Technical indicators added successfully")
        return result
    except Exception as e:
        logger.error(f"Error adding technical indicators: {str(e)}")
        logger.error(traceback.format_exc())
        return None

def preprocess_data(data):
    logger.info("Preprocessing data")
    try:
        # Handle missing values first
        data = data.fillna(method='ffill').fillna(method='bfill')
        
        # Extract price data (open, high, low, close)
        price_data = data[['open', 'high', 'low', 'close']].values
        # Extract technical indicators (excluding price columns)
        indicator_data = data.drop(['open', 'high', 'low', 'close'], axis=1).values
        
        # Log shapes for debugging
        logger.info(f"Price data shape: {price_data.shape}")
        logger.info(f"Indicator data shape: {indicator_data.shape}")
        
        # Scale price and indicators separately
        scaled_price = price_scaler.transform(price_data)
        scaled_indicators = indicator_scaler.transform(indicator_data)
        
        # Combine scaled price data and indicators
        scaled_data = np.hstack((scaled_price, scaled_indicators))
        logger.info(f"Final preprocessed data shape: {scaled_data.shape}")
        
        return scaled_data
    except Exception as e:
        logger.error(f"Error in preprocessing: {str(e)}")
        logger.error(traceback.format_exc())
        raise

def create_sequences(data, time_step=60):
    logger.info(f"Creating sequences with time_step: {time_step}")
    try:
        X, y = [], []
        for i in range(len(data) - time_step - 1):
            # Include all features in the input sequence
            X.append(data[i:(i + time_step), :])
            # Predict the 'close' price of the next time step
            y.append(data[i + time_step, 3])  # Index 3 corresponds to 'close'
        X = np.array(X)
        y = np.array(y)
        logger.info(f"Created sequences with shape: {X.shape}")
        return X, y
    except Exception as e:
        logger.error(f"Error creating sequences: {str(e)}")
        logger.error(traceback.format_exc())
        raise

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data or 'symbol' not in data:
            return jsonify({'error': 'No symbol provided'}), 400
            
        symbol = data['symbol']
        logger.info(f"Processing prediction request for symbol: {symbol}")
        
        # Fetch and validate data
        stock_data = fetch_stock_data(symbol)
        if stock_data is None:
            return jsonify({'error': 'Failed to fetch stock data'}), 400
            
        # Add technical indicators
        feature_data = add_technical_indicators(stock_data)
        if feature_data is None:
            return jsonify({'error': 'Failed to calculate technical indicators'}), 400
            
        # Preprocess the data
        try:
            scaled_data = preprocess_data(feature_data)
        except Exception as e:
            logger.error(f"Preprocessing error: {str(e)}")
            return jsonify({'error': 'Error preprocessing data'}), 500
            
        # Create sequences
        try:
            X, _ = create_sequences(scaled_data)
            if len(X) == 0:
                return jsonify({'error': 'Insufficient data for prediction'}), 400
        except Exception as e:
            logger.error(f"Sequence creation error: {str(e)}")
            return jsonify({'error': 'Error creating sequences'}), 500
            
        # Make prediction
        try:
             latest_sequence = X[-1:]
             prediction = model.predict(latest_sequence)
                
             # Pad the prediction with zeros for the other features (open, high, low)
             # The scaler expects a 2D array with 4 features
             padded_prediction = np.zeros((1, 4))  # Shape: (1, 4)
             padded_prediction[0, 3] = prediction[0][0]  # Set the 'close' value
                
             # Inverse transform the padded prediction
             predicted_price = float(price_scaler.inverse_transform(padded_prediction)[0, 3])  # Extract the 'close' value
             logger.info(f"Predicted price: {predicted_price}")
        except Exception as e:
             logger.error(f"Prediction error: {str(e)}")
             return jsonify({'error': 'Error making prediction'}), 500
            
        # Prepare response data
        latest_data = feature_data.iloc[-1]
        additional_info = {
            'moving_average_fast': float(latest_data['trend_sma_fast']),
            'moving_average_slow': float(latest_data['trend_sma_slow']),
            'rsi': float(latest_data['momentum_rsi']),
            'stochastic': float(latest_data['momentum_stoch']),
            'stochastic_signal': float(latest_data['momentum_stoch_signal']),
            'macd': float(latest_data['trend_macd']),
            'macd_signal': float(latest_data['trend_macd_signal']),
            'macd_histogram': float(latest_data['trend_macd_diff']),
            'atr': float(latest_data['volatility_atr']),
            'bollinger_bands': {
                'middle': float(latest_data['volatility_bbm']),
                'upper': float(latest_data['volatility_bbh']),
                'lower': float(latest_data['volatility_bbl'])
            },
            'volume_indicators': {
                'adi': float(latest_data['volume_adi']),
                'obv': float(latest_data['volume_obv']),
                'mfi': float(latest_data['volume_mfi'])
            }
        }
        
        historical_data = stock_data[['timestamp', 'open', 'high', 'low', 'close', 'volume']].tail(300).to_dict('records')
        
        response = {
            'predicted_price': predicted_price,
            'historical_data': historical_data,
            'additional_info': additional_info,
            'last_updated': stock_data['timestamp'].max().strftime('%Y-%m-%d')
        }
        
        logger.info("Successfully generated prediction response")
        return jsonify(response)
    
    except Exception as e:
        logger.error(f"Unexpected error in predict endpoint: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {str(error)}")
    logger.error(traceback.format_exc())
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True)