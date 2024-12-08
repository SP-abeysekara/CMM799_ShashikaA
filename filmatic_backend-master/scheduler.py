import time
import schedule
import subprocess

def job():
    # Run the training script
    subprocess.run(["python", "training.py"])

# Schedule the job every hour (can be adjusted via a variable)
schedule_interval = 1  # in hours
schedule.every(schedule_interval).hours.do(job)

if __name__ == "__main__":
    print(f"Scheduling training job every {schedule_interval} hour(s).")
    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute
