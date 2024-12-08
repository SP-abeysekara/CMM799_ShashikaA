import pandas as pd
import os

# Load your dataset
dataset = pd.read_csv('dataset_with_imdb_id.csv')

# Determine the number of chunks based on the desired maximum number of rows per file
max_rows_per_file = 5000
num_chunks = len(dataset) // max_rows_per_file + 1

# Create a directory to store the split files if it doesn't exist
output_dir = 'split_files'
os.makedirs(output_dir, exist_ok=True)

# Split the dataset into chunks and write each chunk to a separate CSV file
for i in range(num_chunks):
    start_index = i * max_rows_per_file
    end_index = min((i + 1) * max_rows_per_file, len(dataset))
    chunk = dataset.iloc[start_index:end_index]
    chunk.to_csv(os.path.join(output_dir, f'chunk_{i}.csv'), index=False)

print("Splitting completed.")
