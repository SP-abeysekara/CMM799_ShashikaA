import pickle

import pandas as pd
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split
from surprise import accuracy
from collections import defaultdict
import matplotlib.pyplot as plt

# Load interactions dataset
interactions_df = pd.read_csv('interactions.csv')

# Convert user_id and movie_id to string to ensure compatibility with surprise
interactions_df['user_id'] = interactions_df['user_id'].astype(str)
interactions_df['movie_id'] = interactions_df['movie_id'].astype(str)

# Define a Reader and load the dataset into a Dataset object for surprise
reader = Reader(rating_scale=(1, 5))  # Adjust rating_scale according to your dataset
data = Dataset.load_from_df(interactions_df[['user_id', 'movie_id', 'points']], reader)

# Split the dataset into training and test sets
trainset, testset = train_test_split(data, test_size=0.25)

# Initialize and train the SVD model
model = SVD()
model.fit(trainset)

# save the model to disk
filename = 'cf_model.sav'
pickle.dump(model, open(filename, 'wb'))




# Function to get top-N recommendations for each user
def get_top_n_recommendations(predictions, n=10):
    top_n = defaultdict(list)
    for uid, iid, true_r, est, _ in predictions:
        top_n[uid].append((iid, est))

    # Sort the predictions for each user and retrieve the highest rated items
    for uid, user_ratings in top_n.items():
        user_ratings.sort(key=lambda x: x[1], reverse=True)
        top_n[uid] = user_ratings[:n]

    return top_n


# Predict ratings for the testset
predictions = model.test(testset)

# Compute and print Root Mean Squared Error
accuracy.rmse(predictions)

# Choose a user ID for which to recommend movies
user_id = '10'

# Predict ratings for all movies that the user hasn't rated yet
all_movies = set(interactions_df['movie_id'].unique())
movies_rated_by_user = set(interactions_df[interactions_df['user_id'] == user_id]['movie_id'].unique())
movies_to_predict = list(all_movies - movies_rated_by_user)

# Create a testset for the user
testset = [[user_id, movie_id, 4.] for movie_id in movies_to_predict]  # 4. is a dummy rating value
user_predictions = model.test(testset)

# Get top-N recommendations for the user
top_n_recommendations = get_top_n_recommendations(user_predictions, n=10)

# top_n_recommendations to dataframe
top_n_recommendations_df = pd.DataFrame(top_n_recommendations)

# Display the top-N recommendations for the user
print(f"Top 10 recommendations for User {user_id}:")
for movie_id, predicted_rating in top_n_recommendations[user_id]:
    print(f"Movie: {movie_id}, Predicted Rating: {predicted_rating}")

# Predictions
predictions = model.test(testset)

# Ensure predictions are converted to a DataFrame first
predictions_df = pd.DataFrame([(pred.uid, pred.iid, pred.r_ui, pred.est, pred.details) for pred in predictions],
                              columns=['uid', 'iid', 'rui', 'est', 'details'])

# Plot actual vs. predicted ratings
plt.figure(figsize=(10, 6))
plt.scatter(predictions_df.rui, predictions_df.est, alpha=0.5)
plt.xlabel('Actual Rating')
plt.ylabel('Predicted Rating')
plt.title('Actual vs. Predicted Ratings')
plt.plot([1, 5], [1, 5], 'r--')
plt.savefig('actual_vs_predicted_ratings.png')
plt.show()

# Plot error distribution
plt.figure(figsize=(10, 6))
plt.hist(predictions_df.est - predictions_df.rui, bins=20, alpha=0.5)
plt.xlabel('Prediction Error')
plt.ylabel('Frequency')
plt.title('Prediction Error Distribution')
plt.savefig('prediction_error_distribution.png')
plt.show()
