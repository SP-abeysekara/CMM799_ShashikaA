import subprocess
import asyncio
import pandas as pd
import motor.motor_asyncio
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database client setup
client = motor.motor_asyncio.AsyncIOMotorClient(os.environ["MONGODB_URL"])
db = client[os.environ.get("MONGODB_DATABASE", "test")]

async def fetch_and_save_data():
    # Fetch data from MongoDB
    users_list = await db["users"].find().to_list(10000)
    movies_list = await db["movies"].find().to_list(10000)
    userfavorites_list = await db["userfavorites"].find().to_list(10000)
    userinteractions_list = await db["userinteractions"].find().to_list(10000)

    # Save to CSV
    pd.DataFrame(users_list).to_csv("database/user_data.csv", index=False)
    pd.DataFrame(movies_list).to_csv("database/movie_data.csv", index=False)
    pd.DataFrame(userfavorites_list).to_csv("database/userfavorites_data.csv", index=False)
    pd.DataFrame(userinteractions_list).to_csv("database/userinteractions_data.csv", index=False)

    print("Fetching and saving data from MongoDB...")

def run_training():
    # Run the training script immediately
    subprocess.run(["python", "training.py"])

if __name__ == "__main__":
    # Run the training script once
    print("Running training script initially...")
    run_training()

    # Fetch and save data immediately
    print("Fetching and saving data initially...")
    loop = asyncio.get_event_loop()
    if loop.is_closed():
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

    # Run the coroutine in the event loop
    loop.run_until_complete(fetch_and_save_data())
