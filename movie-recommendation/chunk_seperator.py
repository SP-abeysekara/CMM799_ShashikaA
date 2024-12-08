import os
import shutil

# Define the number of folders
num_folders = 5

# Create folders
for i in range(num_folders):
    folder_name = f'splitted_folder_{i+1}'
    os.makedirs(folder_name, exist_ok=True)

# Get the list of CSV files
csv_files = sorted([file for file in os.listdir() if file.startswith('chunk_') and file.endswith('.csv')])

# Calculate the number of files per folder
files_per_folder = len(csv_files) // num_folders
remainder = len(csv_files) % num_folders

# Distribute files into folders
start_index = 0
for i in range(num_folders):
    end_index = start_index + files_per_folder
    if i < remainder:
        end_index += 1

    # Copy files to the respective folder
    folder_name = f'splitted_folder_{i+1}'
    for file_index in range(start_index, end_index):
        shutil.copy(csv_files[file_index], folder_name)

    # Update start index for the next folder
    start_index = end_index

print("Files have been distributed into folders successfully.")
