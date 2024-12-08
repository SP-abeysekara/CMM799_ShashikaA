import os
import pandas as pd

# Define the paths
data_path = 'processed_data/'
save_path = 'processed_data_final/'

# Ensure the save_path directory exists
os.makedirs(save_path, exist_ok=True)

# Loop through all files in the data_path directory
for filename in os.listdir(data_path):
    if filename.endswith('.csv'):
        # Read the CSV file
        df = pd.read_csv(os.path.join(data_path, filename))

        # Remove rows where title is NaN
        df = df.dropna(subset=['title'])

        # Ensure no NaN values in poster_path and tagline
        df['poster_path'] = df['poster_path'].fillna('')
        df['tagline'] = df['tagline'].fillna('')

        # Print null values (optional)
        print(f'Null values in {filename}:')
        print(df.isnull().sum())

        # Save the processed data
        df.to_csv(os.path.join(save_path, filename), index=False)
