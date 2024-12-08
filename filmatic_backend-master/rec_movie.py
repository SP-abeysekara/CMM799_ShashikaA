import pandas as pd
import numpy as np
import pickle
from sklearn.metrics.pairwise import cosine_similarity
import ast

# Function to assign points based on interaction type
def assign_points(interaction_type):
    interaction_type = str(interaction_type).lower()
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

# Function to process list fields from user favorites
def process_list_field(field_value, field_name=None):
    if pd.notnull(field_value) and field_value != '':
        try:
            # Safely evaluate the string to convert it to a Python object
            items = ast.literal_eval(field_value)
            if field_name == 'favorite_films':
                # Extract movie_ids from the list of dictionaries
                movie_ids = []
                for item in items:
                    if isinstance(item, dict) and 'movie_id' in item:
                        movie_ids.append(int(item['movie_id']))
                return movie_ids
            elif isinstance(items, list):
                # For other fields, ensure items are strings
                return [str(item).strip().lower() for item in items if item]
            else:
                return []
        except (ValueError, SyntaxError):
            # Handle the case where field_value is not a valid Python literal
            return []
    else:
        return []

# Load necessary data and models
def load_models_and_data():
    with open('models/tfidf_vectorizer.pkl', 'rb') as f:
        tfidf_vectorizer = pickle.load(f)

    tfidf_matrix = np.load('models/tfidf_matrix.npy')
    tfidf_matrix = tfidf_matrix.astype(np.float32)

    with open('models/svd_model.pkl', 'rb') as f:
        algo = pickle.load(f)

    df_movie = pd.read_csv('models/df_movie.csv')

    # Load latest user data
    df_userfavorites = pd.read_csv("database/userfavorites_data.csv")
    df_userinteractions = pd.read_csv("database/userinteractions_data.csv")

    return tfidf_vectorizer, tfidf_matrix, algo, df_movie, df_userfavorites, df_userinteractions

# Hybrid Recommendation Function (Now accepts both user_id and movie_id)
def hybrid_rec(user_id=None, movie_id=None, top_n=10, content_weight=0.5, cf_weight=0.5):
    tfidf_vectorizer, tfidf_matrix, algo, df_movie, df_userfavorites, df_userinteractions = load_models_and_data()

    # Initialize user profile vector
    user_profile_vector = np.zeros(tfidf_matrix.shape[1])

    # Build user profile if user_id is provided
    if user_id:
        # Process user favorites
        user_favorites_row = df_userfavorites[df_userfavorites['user_id'] == user_id]

        if not user_favorites_row.empty:
            # Extract fields
            favorite_films = process_list_field(user_favorites_row['favorite_films'].iloc[0], field_name='favorite_films')
            favorite_actors = process_list_field(user_favorites_row['favorite_actors'].iloc[0])
            favorite_genres = process_list_field(user_favorites_row['favorite_genres'].iloc[0])
            wishlist_films = process_list_field(user_favorites_row['wishlist_films'].iloc[0])
            watched_films = process_list_field(user_favorites_row['watched_films'].iloc[0])
            liked_movies = process_list_field(user_favorites_row['liked_movies'].iloc[0])

            # Convert movie IDs to integers (already done in process_list_field for favorite_films)
            favorite_movie_ids = favorite_films
            # For wishlist_films, watched_films, liked_movies, convert strings to integers
            def convert_to_int_list(str_list):
                int_list = []
                for item in str_list:
                    try:
                        int_list.append(int(item))
                    except ValueError:
                        continue
                return int_list

            wishlist_movie_ids = convert_to_int_list(wishlist_films)
            watched_movie_ids = convert_to_int_list(watched_films)
            liked_movie_ids = convert_to_int_list(liked_movies)

            # Debugging prints
            # print("Favorite movie IDs:", favorite_movie_ids)
            # print("Wishlist movie IDs:", wishlist_movie_ids)
            # print("Watched movie IDs:", watched_movie_ids)
            # print("Liked movie IDs:", liked_movie_ids)

            # Aggregate all movie IDs
            all_movie_ids = set(favorite_movie_ids + wishlist_movie_ids + watched_movie_ids + liked_movie_ids)

            # Build user profile vector based on aggregated movies
            user_movies = df_movie[df_movie['movie_id'].isin(all_movie_ids)]
            if not user_movies.empty:
                user_indices = user_movies.index.tolist()
                user_tfidf_matrix = tfidf_matrix[user_indices]
                user_profile_vector = np.mean(user_tfidf_matrix, axis=0)

            # Enhance user profile with favorite actors and genres
            # Find movies with favorite actors and genres
            def match_items_in_column(column_data, items_list):
                return column_data.str.lower().apply(lambda x: any(item in x for item in items_list))

            if favorite_actors:
                actor_movies = df_movie[match_items_in_column(df_movie['cast'], favorite_actors)]
                if not actor_movies.empty:
                    actor_indices = actor_movies.index.tolist()
                    actor_tfidf_matrix = tfidf_matrix[actor_indices]
                    user_profile_vector += 0.3 * np.mean(actor_tfidf_matrix, axis=0)

            if favorite_genres:
                genre_movies = df_movie[match_items_in_column(df_movie['genres'], favorite_genres)]
                if not genre_movies.empty:
                    genre_indices = genre_movies.index.tolist()
                    genre_tfidf_matrix = tfidf_matrix[genre_indices]
                    user_profile_vector += 0.2 * np.mean(genre_tfidf_matrix, axis=0)

    # If movie_id is provided, get its TF-IDF vector
    if movie_id:
        if movie_id in df_movie['movie_id'].values:
            idx = df_movie.index[df_movie['movie_id'] == movie_id][0]
            movie_tfidf_vector = tfidf_matrix[idx]
            if np.linalg.norm(user_profile_vector) != 0:
                # Combine user profile vector and movie vector
                user_profile_vector = 0.7 * user_profile_vector + 0.3 * movie_tfidf_vector
            else:
                user_profile_vector = movie_tfidf_vector
        else:
            print(f"Movie ID {movie_id} not found in the dataset.")
            return []

    # If neither user_id nor movie_id provided, cannot generate recommendations
    if np.linalg.norm(user_profile_vector) == 0:
        print("Insufficient data to generate recommendations.")
        return []

    # Normalize the user profile vector
    user_profile_vector = user_profile_vector / np.linalg.norm(user_profile_vector)

    # Compute content-based scores
    cosine_similarities = cosine_similarity(user_profile_vector.reshape(1, -1), tfidf_matrix).flatten()
    cb_scores = {df_movie.iloc[i]['movie_id']: cosine_similarities[i] for i in range(len(cosine_similarities))}

    # Collaborative filtering scores (only if user_id is provided)
    cf_scores = {}
    if user_id:
        # Assign points to interactions
        df_userinteractions['points'] = df_userinteractions['interaction_type'].apply(assign_points)
        # Get user's interacted movies
        user_interactions = df_userinteractions[df_userinteractions['user_id'] == user_id]
        interacted_movie_ids = user_interactions['movie_id'].unique()

        # Predict ratings for movies the user hasn't interacted with
        all_movie_ids = df_movie['movie_id'].unique()
        movies_to_predict = [mid for mid in all_movie_ids if mid not in interacted_movie_ids]
        for mid in movies_to_predict:
            pred = algo.predict(user_id, mid)
            cf_scores[mid] = pred.est
    else:
        # If no user_id, set collaborative scores to zero
        cf_scores = {mid: 0 for mid in df_movie['movie_id'].unique()}
        interacted_movie_ids = []

    # Combine scores
    hybrid_scores = {}
    for mid in df_movie['movie_id'].unique():
        cb_score = cb_scores.get(mid, 0)
        cf_score = cf_scores.get(mid, 0)
        hybrid_score = content_weight * cb_score + cf_weight * cf_score
        hybrid_scores[mid] = hybrid_score

    # Exclude movies the user has already interacted with
    for mid in interacted_movie_ids:
        if mid in hybrid_scores:
            del hybrid_scores[mid]

    # Exclude the input movie itself if movie_id is provided
    if movie_id and movie_id in hybrid_scores:
        del hybrid_scores[movie_id]

    # Get top N recommendations
    recommended_movie_ids = sorted(hybrid_scores, key=hybrid_scores.get, reverse=True)[:top_n]

    # Get recommended movies
    recommended_movies = df_movie[df_movie['movie_id'].isin(recommended_movie_ids)]

    # Return detailed movie information
    recommendations = recommended_movies.to_dict('records')
    return recommendations


# if __name__ == '__main__':
#     user_id = '6714ab333cce69b6334131b0'  # Replace with actual user ID
#     movie_id = 550  # Replace with actual movie ID (e.g., 'Fight Club' ID)
#     top_n = 10
#
#     # Get hybrid recommendations based on both user_id and movie_id
#     hybrid_recommendations = hybrid_rec(user_id=user_id, movie_id=movie_id, top_n=top_n)
#     print("\nHybrid Recommendations (User and Movie):")
#     for movie in hybrid_recommendations:
#         print(movie)
#
#     # Get hybrid recommendations based on movie_id only
#     hybrid_recommendations_movie_only = hybrid_rec(movie_id=movie_id, top_n=top_n)
#     print("\nHybrid Recommendations (Movie Only):")
#     for movie in hybrid_recommendations_movie_only:
#         print(movie)
#
#     # Get hybrid recommendations based on user_id only
#     hybrid_recommendations_user_only = hybrid_rec(user_id=user_id, top_n=top_n)
#     print("\nHybrid Recommendations (User Only):")
#     for movie in hybrid_recommendations_user_only:
#         print(movie)
