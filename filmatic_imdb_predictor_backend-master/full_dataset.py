import os
import pandas as pd

# Set the directory where your CSV files are located
csv_directory = 'processed_data_final/processed_data_final'

# Create an empty list to store individual DataFrames
df_list = []

# Loop through all CSV files in the directory
for filename in os.listdir(csv_directory):
    if filename.endswith('.csv'):
        # Create the full file path
        file_path = os.path.join(csv_directory, filename)
        # Read each CSV file and append it to the list
        df = pd.read_csv(file_path)
        df_list.append(df)

# Concatenate all DataFrames into one
final_df = pd.concat(df_list, ignore_index=True)    

# Export the concatenated DataFrame to a new CSV file in the current directory
# or provide an absolute path like 'C:/Users/YourUser/concatenated_file.csv'
final_df.to_csv('concatenated_file.csv', index=False)

print("CSV files successfully concatenated and exported!")
