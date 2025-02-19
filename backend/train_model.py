import io
import requests
import os
from flask import Flask, jsonify, request  # type: unused-import
from flask_cors import CORS #type: ignore
import numpy as np
import pandas as pd
import logging
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from tensorflow.keras.models import Sequential, load_model  # Added load_model import
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
from tensorflow.keras.optimizers import Adam
import joblib
from ta import add_all_ta_features
import traceback
from polygon import RESTClient
import matplotlib.pyplot as plt

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
    # Load the trained model and scalers if they exist, else later they will be trained.
    logger.info("Loading model and scalers...")
    model = load_model(os.path.join(MODEL_DIR, 'final_model.h5'))
    price_scaler = joblib.load(os.path.join(MODEL_DIR, 'price_scaler.save'))
    indicator_scaler = joblib.load(os.path.join(MODEL_DIR, 'indicator_scaler.save'))
    logger.info("Model and scalers loaded successfully")
except Exception as e:
    logger.error(f"Error loading model or scalers: {str(e)}")
    logger.info("Proceeding to train a new model.")
    model = None

API_KEY = os.getenv('VANTAGE_API_KEY')
client = RESTClient(api_key="jCQvtKFC39SWJprdqxyiXFpac9UHB9K1")

SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN']
SEQUENCE_LENGTH = 60
TEST_SIZE = 0.2
RANDOM_STATE = 42

def fetch_stock_data(symbol, start_date="2020-01-01", end_date="2024-01-08"):
    try:
        aggs = client.get_aggs(
            ticker=symbol,
            multiplier=1,
            timespan="day",
            from_=start_date,
            to=end_date
        )
        data = [
            {
                'timestamp': agg.timestamp,
                'symbol': symbol,
                'open': agg.open,
                'high': agg.high,
                'low': agg.low,
                'close': agg.close,
                'volume': agg.volume
            }
            for agg in aggs
        ]
        df = pd.DataFrame(data)
        # Polygon returns timestamps in nanoseconds; adjust accordingly if needed
        df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ns')
        df = df.sort_values('timestamp')
        return df
    except Exception as e:
        logger.error(f"Error fetching data for {symbol}: {e}")
        return None

def add_technical_indicators(data):
    try:
        df = data.copy()
        df = add_all_ta_features(
            df, open="open", high="high", low="low", 
            close="close", volume="volume", fillna=True
        )
        selected_features = [
            'open', 'high', 'low', 'close',
            'trend_sma_fast', 'trend_sma_slow', 'trend_macd',
            'trend_macd_signal', 'trend_macd_diff',
            'momentum_rsi', 'momentum_stoch', 'momentum_stoch_signal',
            'momentum_tsi', 'momentum_uo',
            'volatility_atr',
            'volatility_bbm', 'volatility_bbh', 'volatility_bbl',
            'volume_adi', 'volume_obv', 'volume_vwap',
            'volume_mfi',
            'volume_em',
            'volume_sma_em'
        ]
        return df[selected_features].copy()
    except Exception as e:
        logger.error(f"Error adding technical indicators: {str(e)}")
        logger.error(traceback.format_exc())
        return None

def preprocess_data(data):
    # Handle missing values
    data = data.fillna(method='ffill').fillna(method='bfill')
    price_data = data[['open', 'high', 'low', 'close']].values
    indicator_data = data.drop(['open', 'high', 'low', 'close'], axis=1).values

    price_scaler = MinMaxScaler(feature_range=(0, 1))
    indicator_scaler = MinMaxScaler(feature_range=(0, 1))

    scaled_price = price_scaler.fit_transform(price_data)
    scaled_indicators = indicator_scaler.fit_transform(indicator_data)

    scaled_data = np.hstack((scaled_price, scaled_indicators))
    return scaled_data, price_scaler, indicator_scaler

def create_sequences(data, time_step=60):
    X, y = [], []
    for i in range(len(data) - time_step - 1):
        X.append(data[i:(i + time_step), :])
        y.append(data[i + time_step, 3])  # Index 3 for 'close'
    return np.array(X), np.array(y)

def build_lstm_model(input_shape):
    model = Sequential([
        LSTM(128, return_sequences=True, input_shape=input_shape,
             activation='tanh', recurrent_activation='sigmoid'),
        Dropout(0.2),
        LSTM(64, return_sequences=True, activation='tanh', recurrent_activation='sigmoid'),
        Dropout(0.2),
        LSTM(32, return_sequences=False, activation='tanh', recurrent_activation='sigmoid'),
        Dropout(0.2),
        Dense(32, activation='relu'),
        Dense(16, activation='relu'),
        Dense(1)
    ])
    model.compile(optimizer=Adam(learning_rate=0.001), loss='huber', metrics=['mae', 'mse'])
    return model

def moving_average_forecast(data, window=10):
    if len(data) < window:
        return None
    return data['close'].tail(window).mean()

def linear_regression_forecast(data):
    try:
        if len(data) < 10:
            return None
        df = data.tail(30)
        X = np.arange(len(df)).reshape(-1, 1)
        y = df['close'].values
        lr_model = LinearRegression()
        lr_model.fit(X, y)
        next_day = np.array([[len(df)]])
        return lr_model.predict(next_day)[0]
    except Exception as e:
        logger.error(f"Error in linear regression forecast: {str(e)}")
        return None

def backtest_model(model, X_test, y_test, price_scaler):
    # Get predictions from the model
    predictions = model.predict(X_test)
    # Create padded arrays to inverse transform the 'close' prices
    padded_predictions = np.zeros((len(predictions), 4))
    padded_actual = np.zeros((len(y_test), 4))
    padded_predictions[:, 3] = predictions.flatten()
    padded_actual[:, 3] = y_test.flatten()

    inversed_predictions = price_scaler.inverse_transform(padded_predictions)[:, 3]
    inversed_actual = price_scaler.inverse_transform(padded_actual)[:, 3]

    mae = np.mean(np.abs(inversed_predictions - inversed_actual))
    mse = np.mean((inversed_predictions - inversed_actual) ** 2)
    
    # Plot the results
    plt.figure(figsize=(12, 6))
    plt.plot(inversed_actual, label="Actual Price")
    plt.plot(inversed_predictions, label="Predicted Price")
    plt.xlabel("Time Steps")
    plt.ylabel("Price")
    plt.title("Backtest: Actual vs Predicted Price")
    plt.legend()
    plt.savefig("backtest_plot.png")
    plt.close()

    logger.info(f"Backtesting completed: MAE={mae:.2f}, MSE={mse:.2f}. Plot saved as backtest_plot.png")
    return mae, mse

def main():
    os.makedirs('models', exist_ok=True)
    combined_data = []
    logger.info("Fetching stock data...")
    for symbol in SYMBOLS:
        stock_data = fetch_stock_data(symbol)
        if stock_data is not None:
            logger.info(f"Processing data for {symbol}...")
            feature_data = add_technical_indicators(stock_data)
            if feature_data is not None:
                combined_data.append(feature_data)
    
    if not combined_data:
        logger.error("No data fetched. Exiting...")
        return
    
    all_data = pd.concat(combined_data, ignore_index=True)
    all_data = all_data.fillna(method='ffill').fillna(method='bfill')
    
    logger.info("Preprocessing data...")
    scaled_data, price_scaler, indicator_scaler = preprocess_data(all_data)
    
    logger.info("Creating sequences...")
    X, y = create_sequences(scaled_data, SEQUENCE_LENGTH)
    logger.info(f"Created {len(X)} sequences.")
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, shuffle=False
    )
    
    global model  # so we can update the global variable if needed
    if model is None:
        logger.info("Building LSTM model...")
        model = build_lstm_model((X.shape[1], X.shape[2]))
    
        callbacks = [
            EarlyStopping(monitor='val_loss', patience=20, restore_best_weights=True),
            ModelCheckpoint('models/best_model.h5', monitor='val_loss', save_best_only=True),
            ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=5, min_lr=0.00001)
        ]
    
        logger.info("Training model...")
        history = model.fit(
            X_train, y_train,
            validation_data=(X_test, y_test),
            epochs=100,
            batch_size=32,
            callbacks=callbacks,
            verbose=1
        )
    
        logger.info("Saving model and scalers...")
        model.save('models/final_model.h5')
        joblib.dump(price_scaler, 'models/price_scaler.save')
        joblib.dump(indicator_scaler, 'models/indicator_scaler.save')
    
        history_df = pd.DataFrame(history.history)
        history_df.to_csv('models/training_history.csv')
    
    # Perform backtesting on the test set
    logger.info("Performing backtesting...")
    mae, mse = backtest_model(model, X_test, y_test, price_scaler)
    logger.info(f"Backtest results - MAE: {mae:.2f}, MSE: {mse:.2f}")
    
    logger.info("Training and backtesting completed successfully!")

if __name__ == '__main__':
    main()
