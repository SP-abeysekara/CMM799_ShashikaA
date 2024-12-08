import pandas as pd
from tqdm import tqdm
from utils.text_processing import preprocess_text
from multiprocessing import Pool, cpu_count

# Show all columns
pd.set_option('display.max_columns', None)

# # Ensure required NLTK resources are downloaded
# def download_nltk_resources():
#     resources = [
#         ('wordnet', 'corpora/wordnet'),
#         ('punkt', 'tokenizers/punkt'),
#         ('stopwords', 'corpora/stopwords')
#     ]
#
#     for resource, path in resources:
#         try:
#             nltk.data.find(path)
#             print(f'{resource} is already downloaded.')
#         except LookupError:
#             nltk.download(resource)
#
#
# download_nltk_resources()

data_path = 'split_files_with_info 0 - 68/'
save_path = 'processed_data/'

chunk_list = [f'chunk_{i}_with_info.csv' for i in range(0, 114)]

def parallel_apply(df, func, column, remove_stopwords=True):
    # Convert DataFrame column to list
    data = df[column].tolist()
    # Prepare arguments for the function
    arguments = [(text, remove_stopwords) for text in data]
    print(cpu_count())
    # Initialize pool
    with Pool(processes=12) as pool:
        results = pool.starmap(func, arguments)
    # Assign results back to DataFrame
    df[column] = results
    return df

def process_data_chunks(data_chunk):
    df = pd.read_csv(data_path + data_chunk)

    # Replace missing values for each column
    df['title'] = df['title'].fillna('Unknown')
    df['vote_average'] = df['vote_average'].fillna(df['vote_average'].mean())
    df['vote_count'] = df['vote_count'].fillna(0)
    df['status'] = df['status'].fillna('Unknown')
    df['release_date'] = df['release_date'].fillna('1900-01-01')
    df['revenue'] = df['revenue'].fillna(0)
    df['runtime'] = df['runtime'].fillna(df['runtime'].mean())
    df['adult'] = df['adult'].fillna(False)
    df['backdrop_path'] = df['backdrop_path'].fillna('')
    df['budget'] = df['budget'].fillna(0)
    df['homepage'] = df['homepage'].fillna('')
    df['imdb_id'] = df['imdb_id'].fillna('')
    df['original_language'] = df['original_language'].fillna('Unknown')
    df['original_title'] = df['original_title'].fillna('Unknown')
    df['overview'] = df['overview'].fillna('No overview available')
    df['popularity'] = df['popularity'].fillna(df['popularity'].mean())
    df['poster_path'] = df['poster_path'].fillna('')
    df['tagline'] = df['tagline'].fillna('')
    df['genres'] = df['genres'].fillna('Unknown')
    df['production_companies'] = df['production_companies'].fillna('Unknown')
    df['production_countries'] = df['production_countries'].fillna('Unknown')
    df['spoken_languages'] = df['spoken_languages'].fillna('Unknown')
    df['keywords'] = df['keywords'].fillna('None')
    df['description'] = df['description'].fillna('No description available')
    df['directors'] = df['directors'].fillna('Unknown')
    df['main_characters'] = df['main_characters'].fillna('Unknown')

    # Convert data types
    df['release_date'] = pd.to_datetime(df['release_date'], errors='coerce')
    df['vote_average'] = df['vote_average'].astype(float)
    df['vote_count'] = df['vote_count'].astype(int)
    df['revenue'] = df['revenue'].astype(int)
    df['runtime'] = df['runtime'].astype(int)
    df['budget'] = df['budget'].astype(int)
    df['popularity'] = df['popularity'].astype(float)

    # Standardize categorical data
    categorical_columns = ['status', 'original_language', 'genres', 'production_companies', 'production_countries',
                           'spoken_languages', 'keywords', 'directors', 'main_characters']
    for column in categorical_columns:
        df[column] = df[column].str.lower().str.strip()

    # Drop columns that are not needed
    columns_to_drop = ['backdrop_path', 'homepage']
    df = df.drop(columns=columns_to_drop)

    print("Processing text data...")

    # Process text data in parallel
    df = parallel_apply(df, preprocess_text, 'overview', remove_stopwords=True)
    df = parallel_apply(df, preprocess_text, 'description', remove_stopwords=True)
    df = parallel_apply(df, preprocess_text, 'title', remove_stopwords=False)
    df = parallel_apply(df, preprocess_text, 'tagline', remove_stopwords=False)

    df.to_csv(save_path + data_chunk, index=False)
    df = pd.read_csv(save_path + data_chunk)

    # remove rows where title is NaN
    df = df.dropna(subset=['title'])

    # Ensure no NaN values in poster_path and tagline
    df['poster_path'] = df['poster_path'].fillna('')
    df['tagline'] = df['tagline'].fillna('')

    # Save the processed data
    df.to_csv(save_path + data_chunk, index=False)
    print(f'Processed data saved to {save_path + data_chunk}')


if __name__ == '__main__':
    for chunk in tqdm(chunk_list, desc="Processing Chunks"):
        try:
            process_data_chunks(chunk)
        except Exception as e:
            print(f"Error processing {chunk}: {e}")
