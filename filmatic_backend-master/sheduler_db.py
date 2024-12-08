import time
import schedule
import pandas as pd
import motor.motor_asyncio
import os
import asyncio

# Load environment variables
from dotenv import load_dotenv

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

def job():
    # Get the current event loop or create a new one if it does not exist
    loop = asyncio.get_event_loop()
    if loop.is_closed():
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

    # Run the coroutine in the existing event loop
    loop.run_until_complete(fetch_and_save_data())

# Schedule the job every hour (can be adjusted via a variable)
schedule_interval = 30
schedule.every(schedule_interval).minutes.do(job)

if __name__ == "__main__":
    print(f"Scheduling training job every {schedule_interval} minutes...")
    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every second
