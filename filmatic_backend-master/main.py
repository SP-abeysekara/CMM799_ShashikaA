import os
from typing import List, Optional

import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import motor.motor_asyncio

# Load environment variables
from dotenv import load_dotenv

load_dotenv()

# Initialize FastAPI app with CORS middleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Database client setup
client = motor.motor_asyncio.AsyncIOMotorClient(os.environ["MONGODB_URL"])

db = client[os.environ.get("MONGODB_DATABASE", "test")]

# Import recommendation functions
from rec_movie import hybrid_rec

# Pydantic models
class RecommendationRequest(BaseModel):
    user_id: Optional[str] = None
    movie_id: Optional[int] = None
    top_n: Optional[int] = 10

@app.post("/update_data")
async def update_data():
    """
    Endpoint to load data from MongoDB and save to CSV files.
    """
    try:
        # Fetch data from MongoDB
        users_list = await db["users"].find().to_list(10000)
        movies_list = await db["movies"].find().to_list(10000)
        userfavorites_list = await db["userfavorites"].find().to_list(10000)
        userinteractions_list = await db["userinteractions"].find().to_list(10000)

        # Save to CSV
        df_user = pd.DataFrame(users_list)
        df_user.to_csv("database/user_data.csv", index=False)
        df_movie = pd.DataFrame(movies_list)
        df_movie.to_csv("database/movie_data.csv", index=False)
        df_userfavorites = pd.DataFrame(userfavorites_list)
        df_userfavorites.to_csv("database/userfavorites_data.csv", index=False)
        df_userinteractions = pd.DataFrame(userinteractions_list)
        df_userinteractions.to_csv("database/userinteractions_data.csv", index=False)

        return {"status": "Data updated successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend")
async def get_recommendations(request: RecommendationRequest):
    """
    Generate recommendations based on user ID, movie ID, or both.
    """
    user_id = request.user_id
    movie_id = request.movie_id
    top_n = request.top_n

    # Validate inputs
    if not user_id and not movie_id:
        raise HTTPException(status_code=400, detail="Please provide at least a user_id or movie_id.")

    try:
        recommendations = hybrid_rec(user_id=user_id, movie_id=movie_id, top_n=top_n)
        if not recommendations:
            return {"recommendations": []}
        return {"recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend_offline")
def get_recommendations_offline(request: RecommendationRequest):
    """
    Generate recommendations without loading data from MongoDB, using existing CSVs and pre-trained models.
    """
    user_id = request.user_id
    movie_id = request.movie_id
    top_n = request.top_n

    # Validate inputs
    if not user_id and not movie_id:
        raise HTTPException(status_code=400, detail="Please provide at least a user_id or movie_id.")

    try:
        recommendations = hybrid_rec(user_id=user_id, movie_id=movie_id, top_n=top_n)
        if not recommendations:
            return {"recommendations": []}
        return {"recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
