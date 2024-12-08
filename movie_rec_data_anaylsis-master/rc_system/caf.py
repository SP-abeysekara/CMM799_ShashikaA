import pandas as pd
from cb import get_cb_recommendations
from cf_predict import get_cf_recommendations
import random
from datetime import datetime


user_id = 1

# Load your datasets
items_df = pd.read_csv("item_features.csv")
interactions_df = pd.read_csv('interactions.csv')

cb_recommendations = get_cb_recommendations(int(user_id), interactions_df, items_df)
# keep only ['movie_id', 'recStrength']
cb_recommendations = cb_recommendations[['movie_id', 'recStrength']]
# print(f"User {user_id} content-based recommendations: \n{cb_recommendations}")

cf_recommendations = get_cf_recommendations(str(user_id), items_df)
# keep only ['movie_id', 'recStrength']
cf_recommendations = cf_recommendations[['movie_id', 'recStrength']]
# print(f"User {user_id} collaborative filtering recommendations: \n{cf_recommendations}")



# Merge CB and CF recommendations
combined_recommendations = pd.concat([cb_recommendations, cf_recommendations])


def combine_recommendations(user_id, cb_recommendations, cf_recommendations, weighted=False, cb_weight=0.33,
                            cf_weight=0.67):
    # Check if weighted approach is selected
    if weighted:
        # Apply weights to the 'recStrength' column directly
        cb_recommendations['weightedRecStrength'] = cb_recommendations['recStrength'] * cb_weight
        cf_recommendations['weightedRecStrength'] = cf_recommendations['recStrength'] * cf_weight

        # Merge the two DataFrames
        combined_recommendations = pd.concat([cb_recommendations[['movie_id', 'weightedRecStrength']],
                                              cf_recommendations[['movie_id', 'weightedRecStrength']]])

        # Group by 'movie_id' and sum up 'weightedRecStrength' to combine weights of CB and CF where applicable
        merged_recommendations = combined_recommendations.groupby('movie_id', as_index=False).agg({
            'weightedRecStrength': 'sum'
        }).sort_values('weightedRecStrength', ascending=False).reset_index(drop=True)

        # Rename the 'weightedRecStrength' column to 'recStrength'
        merged_recommendations.rename(columns={'weightedRecStrength': 'recStrength'}, inplace=True)

        # Output the merged recommendations with weighted scores
        # print(f"User {user_id} merged recommendations with weighted scores:\n{merged_recommendations}")
    else:
        # For the non-weighted approach, directly concatenate and average the scores where overlaps occur
        combined_recommendations = pd.concat([cb_recommendations, cf_recommendations])

        # Group by 'movie_id' and average 'recStrength' where movies appear in both CB and CF recommendations
        merged_recommendations = combined_recommendations.groupby('movie_id', as_index=False).agg({
            'recStrength': 'mean'
        }).sort_values('recStrength', ascending=False).reset_index(drop=True)

        # Output the merged non-weighted recommendations
        # print(f"User {user_id} merged recommendations without weights:\n{merged_recommendations}")

    return merged_recommendations


# Merge CB and CF recommendations with weights
merged_recommendations_weighted = combine_recommendations(user_id, cb_recommendations, cf_recommendations, weighted=True,
                                                          cb_weight=0.33, cf_weight=0.67)

# Merge CB and CF recommendations without weights
merged_recommendations = combine_recommendations(user_id, cb_recommendations, cf_recommendations)

# print(f"User {user_id} merged recommendations without weights:\n{merged_recommendations}", end='\n\n')
#
# print(f"User {user_id} merged recommendations with weighted scores:\n{merged_recommendations_weighted}")




# Define a function to get the current time of day
def get_time_of_day():
    current_hour = datetime.now().hour
    if 5 <= current_hour < 12:
        return 'Morning'
    elif 12 <= current_hour < 17:
        return 'Afternoon'
    elif 17 <= current_hour < 21:
        return 'Evening'
    else:
        return 'Night'

# Define functions to randomly pick other context attributes
def get_random_location():
    return random.choice(['Home', 'Travel', 'Work', 'Outdoor'])

def get_random_social_context():
    return random.choice(['Alone', 'Family', 'Friends', 'Partner'])

def get_random_mood():
    return random.choice(['Happy', 'Sad', 'Excited', 'Relaxed', 'Tired', 'Stressed'])

def get_random_device():
    return random.choice(['Laptop', 'Smartphone', 'Smart TV', 'Tablet'])

# Function to compile the user context
def get_user_context():
    user_context = {
        'time_of_day': get_time_of_day(),
        'location': get_random_location(),
        'social_context': get_random_social_context(),
        'mood': get_random_mood(),
        'device': get_random_device()
    }
    return user_context



def adjust_recommendations_with_rules(recommendations, user_context):
    # Location adjustments
    location_boost = {'Home': 1.0, 'Travel': 1.05, 'Work': 0.95, 'Outdoor': 1.10}
    recommendations['recStrength'] *= location_boost.get(user_context['location'], 1.0)

    # Time of Day adjustments
    time_of_day_boost = {'Morning': 1.05, 'Afternoon': 1.0, 'Evening': 1.10, 'Night': 1.15}
    recommendations['recStrength'] *= time_of_day_boost.get(user_context['time_of_day'], 1.0)

    # Social Context adjustments
    social_context_boost = {'Alone': 1.05, 'Family': 1.10, 'Friends': 1.10, 'Partner': 1.10}
    recommendations['recStrength'] *= social_context_boost.get(user_context['social_context'], 1.0)

    # Mood adjustments
    mood_boost = {'Happy': 1.10, 'Sad': 1.05, 'Excited': 1.15, 'Relaxed': 1.10, 'Tired': 1.0, 'Stressed': 1.05}
    recommendations['recStrength'] *= mood_boost.get(user_context['mood'], 1.0)

    # Device adjustments
    device_boost = {'Laptop': 1.0, 'Smartphone': 0.95, 'Smart TV': 1.10, 'Tablet': 1.05}
    recommendations['recStrength'] *= device_boost.get(user_context['device'], 1.0)

    # Sort recommendations based on the adjusted recStrength
    recommendations = recommendations.sort_values(by='recStrength', ascending=False).reset_index(drop=True)
    return recommendations



# Get user context
user_context = get_user_context()

# Adjust recommendations based on user context
adjusted_recommendations = adjust_recommendations_with_rules(merged_recommendations_weighted, user_context)

print(f"User {user_id} adjusted recommendations based on user context:\n{adjusted_recommendations}")

