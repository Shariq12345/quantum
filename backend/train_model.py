import numpy as np  # type: ignore
import pandas as pd  # type: ignore
from sklearn.preprocessing import MinMaxScaler  # type: ignore
from sklearn.model_selection import train_test_split  # type: ignore
from tensorflow.keras.models import Sequential  # type: ignore
from tensorflow.keras.layers import LSTM, Dense, Dropout  # type: ignore
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau  # type: ignore
from tensorflow.keras.optimizers import Adam  # type: ignore
import joblib  # type: ignore
import os
from ta import add_all_ta_features  # type: ignore
from polygon import RESTClient # type: ignore

# Configuration
POLYGON_API_KEY = os.getenv('POLYGON_API_KEY')
client = RESTClient(api_key="jCQvtKFC39SWJprdqxyiXFpac9UHB9K1")
SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN']  # List of stock symbols
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
        df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ns')
        df = df.sort_values('timestamp')
        return df
    except Exception as e:
        print(f"Error fetching data for {symbol}: {e}")
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
            # 'close',  # Price
            'trend_sma_fast', 'trend_sma_slow', 'trend_macd',
            'trend_macd_signal', 'trend_macd_diff',  # MACD Histogram
            'momentum_rsi', 'momentum_stoch', 'momentum_stoch_signal',  # Stochastic Oscillator
            'momentum_tsi',  # True Strength Index
            'momentum_uo',  # Ultimate Oscillator
            'volatility_atr',  # Average True Range
            'volatility_bbm', 'volatility_bbh', 'volatility_bbl',  # Bollinger Bands
            'volume_adi', 'volume_obv', 'volume_vwap',  # Volume Indicators
            'volume_mfi',  # Money Flow Index
            'volume_em',  # Ease of Movement
            'volume_sma_em'  # SMA of Ease of Movement
        ]
        return df[selected_features].copy()
    except Exception as e:
        print(f"Error adding technical indicators: {e}")
        return None

def preprocess_data(data):
    # Extract price data (open, high, low, close)
    price_data = data[['open', 'high', 'low', 'close']].values
    # Extract technical indicators (excluding price columns)
    indicator_data = data.drop(['open', 'high', 'low', 'close'], axis=1).values

    # Scale price data and indicators separately
    price_scaler = MinMaxScaler(feature_range=(0, 1))
    indicator_scaler = MinMaxScaler(feature_range=(0, 1))

    scaled_price = price_scaler.fit_transform(price_data)
    scaled_indicators = indicator_scaler.fit_transform(indicator_data)

    # Combine scaled price data and indicators
    scaled_data = np.hstack((scaled_price, scaled_indicators))
    return scaled_data, price_scaler, indicator_scaler

def create_sequences(data, time_step=60):
    X, y = [], []
    for i in range(len(data) - time_step - 1):
        # Include all features in the input sequence
        X.append(data[i:(i + time_step), :])
        # Predict the 'close' price of the next time step
        y.append(data[i + time_step, 3])  # Index 3 corresponds to 'close'
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
        Dense(1)  # Predict the 'close' price
    ])
    model.compile(optimizer=Adam(learning_rate=0.001), loss='huber', metrics=['mae', 'mse'])
    return model

def main():
    os.makedirs('models', exist_ok=True)
    combined_data = []
    print("Fetching stock data...")
    for symbol in SYMBOLS:
        stock_data = fetch_stock_data(symbol)
        if stock_data is not None:
            print(f"Processing data for {symbol}...")
            feature_data = add_technical_indicators(stock_data)
            if feature_data is not None:
                combined_data.append(feature_data)
    
    if not combined_data:
        print("No data fetched. Exiting...")
        return
    
    all_data = pd.concat(combined_data, ignore_index=True)
    all_data = all_data.fillna(method='ffill').fillna(method='bfill')
    
    print("Preprocessing data...")
    scaled_data, price_scaler, indicator_scaler = preprocess_data(all_data)
    
    print("Creating sequences...")
    X, y = create_sequences(scaled_data, SEQUENCE_LENGTH)
    print(f"Created {len(X)} sequences.")
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, shuffle=False
    )
    
    print("Building LSTM model...")
    model = build_lstm_model((X.shape[1], X.shape[2]))
    
    callbacks = [
        EarlyStopping(monitor='val_loss', patience=20, restore_best_weights=True),
        ModelCheckpoint('models/best_model.h5', monitor='val_loss', save_best_only=True),
        ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=5, min_lr=0.00001)
    ]
    
    print("Training model...")
    history = model.fit(
        X_train, y_train,
        validation_data=(X_test, y_test),
        epochs=100,
        batch_size=32,
        callbacks=callbacks,
        verbose=1
    )
    
    print("Saving models and scalers...")
    model.save('models/final_model.h5')
    joblib.dump(price_scaler, 'models/price_scaler.save')
    joblib.dump(indicator_scaler, 'models/indicator_scaler.save')
    
    history_df = pd.DataFrame(history.history)
    history_df.to_csv('models/training_history.csv')
    
    print("Training completed successfully!")

if __name__ == '__main__':
    main()