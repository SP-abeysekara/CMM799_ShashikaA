# IMDb Rating Prediction API

This FastAPI application provides endpoints for predicting IMDb ratings using various machine learning models (XGBoost, Linear Regression, and Logistic Regression). The API takes movie features as input and returns a predicted rating.

### Install Dependencies

To install all required packages, you can use:

```bash
pip install -r requirements.txt
```

## Setup Instructions

1. **Place Model Files**: Ensure your trained model files (`imdb_rating_XGBoost_model.pkl`, `imdb_rating_LinearRegression_model.pkl`, and `imdb_rating_LogisticRegression_model.pkl`) are in the `imdb_trained_models` folder.

2. **Start the API**: Run the FastAPI server using Uvicorn.

   ```bash
   uvicorn main:app --reload
   ```

   The API will be available at `http://127.0.0.1:8000`.

## Request Body Format

The following JSON format can be used for the request body:

```json
{
  "runtime": 149.0,
  "release_year": 2018,
  "genres": "adventure, action, science fiction",
  "production_companies": "marvel studios",
  "production_countries": "united states of america",
  "original_language": "english",
  "directors": "anthony russo, joe russo",
  "main_characters": "robert downey jr., chris hemsworth, mark ruffalo",
  "keywords": "sacrifice, magic, superhero, based on comic, space, battlefield, genocide, magical object, super power, aftercreditsstinger, marvel cinematic universe (mcu), cosmic"
}
```

## Testing with Postman

**Select POST** and enter one of the following URLs based on the model you want to test:
   - `http://127.0.0.1:8000/predict_xgboost`
   - `http://127.0.0.1:8000/predict_linear_regression`
   - `http://127.0.0.1:8000/predict_logistic_regression`

