import os
import pandas as pd
import requests
import json
from tqdm import tqdm


# Function to extract movie details from IMDb using IMDb ID
def extract_movie_details(imdb_id):
    try:
        # Set timeout to 60 seconds
        url = f"https://www.imdb.com/title/{imdb_id}/"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
        }
        with requests.Session() as session:
            response = session.get(url, headers=headers, timeout=60)
            response.raise_for_status()  # Raise an exception for 4xx or 5xx status codes
            script_start = response.text.find('<script type="application/ld+json">')
            script_end = response.text.find('</script>', script_start)
            json_data = response.text[script_start + len('<script type="application/ld+json">'):script_end]
            movie_data = json.loads(json_data)

        # Extract description
        description = movie_data.get('description', '')

        # Extract directors
        directors = ', '.join([director['name'] for director in movie_data.get('director', [])])

        # Extract main characters
        main_characters = ', '.join([actor['name'] for actor in movie_data.get('actor', [])])

        return {
            'description': description,
            'directors': directors,
            'main_characters': main_characters
        }
    except Exception as e:
        return {
            'description': '',
            'directors': '',
            'main_characters': ''
        }


# Load your dataset
file_number = 0
# Assuming your dataset is in a CSV file named 'movies.csv' and contains a column named 'imdb_id'
dataset = pd.read_csv(f'split_files/chunk_{file_number}.csv')

# Create empty lists to store extracted information
descriptions = []
directors_list = []
main_characters_list = []

# Apply the function to each row in the dataset with a progress bar
for index, imdb_id in enumerate(tqdm(dataset['imdb_id'])):
    extracted_info = extract_movie_details(imdb_id)
    descriptions.append(extracted_info['description'])
    directors_list.append(extracted_info['directors'])
    main_characters_list.append(extracted_info['main_characters'])

    # Save the updated dataset to CSV after every 500 iterations
    if (index + 1) % 500 == 0:
        dataset.loc[:index, 'description'] = descriptions
        dataset.loc[:index, 'directors'] = directors_list
        dataset.loc[:index, 'main_characters'] = main_characters_list
        output_dir = 'intermediate_split_files_with_info'
        os.makedirs(output_dir, exist_ok=True)
        dataset.to_csv(os.path.join(output_dir, f'chunk_{file_number}_with_info.csv'), index=False)

# Save the final updated dataset to CSV
dataset['description'] = descriptions
dataset['directors'] = directors_list
dataset['main_characters'] = main_characters_list
output_dir = 'split_files_with_info'
os.makedirs(output_dir, exist_ok=True)
dataset.to_csv(os.path.join(output_dir, f'chunk_{file_number}_with_info.csv'), index=False)
