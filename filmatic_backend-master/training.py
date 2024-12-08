import pandas as pd
import numpy as np
import pickle
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from surprise import SVD, Dataset, Reader

# Ensure the models directory exists
if not os.path.exists('models'):
    os.makedirs('models')

# Load data from CSV files
df_user = pd.read_csv("database/user_data.csv")
df_movie = pd.read_csv("database/movie_data.csv")
df_userfavorites = pd.read_csv("database/userfavorites_data.csv")
df_userinteractions = pd.read_csv("database/userinteractions_data.csv")

# Preprocessing steps
def preprocess_movies(df_movie):
    # Fill NaN values
    df_movie['overview'] = df_movie['overview'].fillna('')
    df_movie['genres'] = df_movie['genres'].fillna('')
    df_movie['keywords'] = df_movie['keywords'].fillna('')
    df_movie['cast'] = df_movie['cast'].fillna('')
    df_movie['directors'] = df_movie['directors'].fillna('')
    df_movie['production_companies'] = df_movie['production_companies'].fillna('')
    df_movie['production_countries'] = df_movie['production_countries'].fillna('')
    df_movie['spoken_languages'] = df_movie['spoken_languages'].fillna('')

    # Combine features for content-based filtering
    df_movie['combined_features'] = df_movie['genres'] + ' ' + \
                                    df_movie['keywords'] + ' ' + \
                                    df_movie['cast'] + ' ' + \
                                    df_movie['directors'] + ' ' + \
                                    df_movie['overview'] + ' ' + \
                                    df_movie['production_companies'] + ' ' + \
                                    df_movie['production_countries'] + ' ' + \
                                    df_movie['spoken_languages']
    return df_movie

df_movie = preprocess_movies(df_movie)

# Build TF-IDF matrix for movies
tfidf_vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf_vectorizer.fit_transform(df_movie['combined_features'])

# Save the TF-IDF vectorizer and matrix
with open('models/tfidf_vectorizer.pkl', 'wb') as f:
    pickle.dump(tfidf_vectorizer, f)

np.save('models/tfidf_matrix.npy', tfidf_matrix.toarray())

# For collaborative filtering, we need to train the SVD model

# Function to assign points based on interaction type
def assign_points(interaction_type):
    interaction_type = interaction_type.lower()
    if interaction_type == "finished":
        return 5
    elif interaction_type == "watched":
        return 4
    elif interaction_type == "liked":
        return 3
    elif interaction_type == "wishlisted":
        return 2
    elif interaction_type == "clicked":
        return 1
    elif interaction_type == "unliked":
        return -1
    elif interaction_type == "unwishlisted":
        return -2
    elif interaction_type == "unwatched":
        return -3
    else:
        return 0  # Default for any other interaction

df_userinteractions['points'] = df_userinteractions['interaction_type'].apply(assign_points)

# Use Surprise Reader to load data
reader = Reader(rating_scale=(-3, 5))  # Adjust rating scale based on point range
data = Dataset.load_from_df(df_userinteractions[['user_id', 'movie_id', 'points']], reader)

# Build full trainset
trainset = data.build_full_trainset()

# Train the SVD algorithm
algo = SVD()
algo.fit(trainset)

# Save the trained model
with open('models/svd_model.pkl', 'wb') as f:
    pickle.dump(algo, f)

# Save other necessary data
df_movie.to_csv('models/df_movie.csv', index=False)
