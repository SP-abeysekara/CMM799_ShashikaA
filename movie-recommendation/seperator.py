import pandas as pd

# Load your dataset
dataset = pd.read_csv('movie-dataset/TMDB_movie_dataset_v11.csv')

# Drop rows with missing values in both 'imdb_id' and 'original_title' columns
dataset.dropna(subset=['imdb_id', 'original_title'], how='all', inplace=True)

# Separate rows with 'imdb_id' into one dataframe
df_with_imdb_id = dataset.dropna(subset=['imdb_id'])

# Separate rows without 'imdb_id' but with 'original_title' into another dataframe
df_without_imdb_id = dataset[dataset['imdb_id'].isna()]

# Save each dataframe to a separate CSV file
df_with_imdb_id.to_csv('dataset_with_imdb_id.csv', index=False)
df_without_imdb_id.to_csv('dataset_without_imdb_id.csv', index=False)
