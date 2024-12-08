# main.py
import joblib
from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

# Load the trained models
# rf_model = joblib.load('/content/imdb_rating_RandomForestRegressor_model.pkl')
xgb_model = joblib.load('imdb_trained_models/imdb_rating_XGBoost_model.pkl')
lr_model = joblib.load('imdb_trained_models/imdb_rating_LinearRegression_model.pkl')
logistic_model = joblib.load('imdb_trained_models/imdb_rating_LogisticRegression_model.pkl')

# Initialize FastAPI
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Define the request body using Pydantic
class MovieFeatures(BaseModel):
    runtime: float
    release_year: int
    genres: str
    production_companies: str
    production_countries: str
    original_language: str
    directors: str
    main_characters: str
    keywords: str

# Preprocessing function for input data
def preprocess_input(data: dict):
    # Convert input dictionary to DataFrame
    df = pd.DataFrame([data])
    # Perform the necessary transformations for each feature
    df['release_year'] = df['release_year'].astype(int)
    # Further preprocessing can be added here if required
    return df

# Endpoint for RandomForestRegressor model prediction
# @app.post("/predict_random_forest")
# def predict_random_forest(features: MovieFeatures):
#     input_data = preprocess_input(features.dict())
#     prediction = rf_model.predict(input_data)
#     return {"predicted_vote_average": prediction[0]}

# Endpoint for XGBoost model prediction
@app.post("/predict_xgboost")
def predict_xgboost(features: MovieFeatures):
    input_data = preprocess_input(features.dict())
    print(features)
    prediction = xgb_model.predict(input_data)
    return {"predicted_vote_average": float(prediction[0])}

# Endpoint for Linear Regression model prediction
@app.post("/predict_linear_regression")
def predict_linear_regression(features: MovieFeatures):
    input_data = preprocess_input(features.dict())
    prediction = lr_model.predict(input_data)
    return {"predicted_vote_average": float(prediction[0])}

# Endpoint for Logistic Regression model prediction (classification approach)
@app.post("/predict_logistic_regression")
def predict_logistic_regression(features: MovieFeatures):
    input_data = preprocess_input(features.dict())
    prediction = logistic_model.predict(input_data)
    return {"predicted_category": int(prediction[0])}

# Run the server with: uvicorn main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
