import pandas as pd
import pickle
from surprise import Reader, Dataset

# Load the optimized model from disk
filename = 'cf_model.sav'
loaded_model = pickle.load(open(filename, 'rb'))



def get_cf_recommendations(user_id, items_df):
    # Predict the rating for each item for the user
    user_recommendations = []

    for movie_id in items_df['movie_id'].unique():
        # Predict the rating
        prediction = loaded_model.predict(str(user_id), str(movie_id))
        user_recommendations.append((movie_id, prediction.est))

    # Retrieve the top-k items with the highest estimated ratings
    k = 10
    user_recommendations.sort(key=lambda x: x[1], reverse=True)
    top_k_recommendations = user_recommendations[:k]

    # Convert the top-k recommendations to a DataFrame
    recommendations_df = pd.DataFrame(top_k_recommendations, columns=['movie_id', 'recStrength'])

    # Output the top-k recommendations for the user
    # print(f"User {user_id} top-{k} recommendations: \n{recommendations_df}")

    return recommendations_df
