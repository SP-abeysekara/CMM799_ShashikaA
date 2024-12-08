import pandas as pd
import numpy as np
from scipy.sparse import csr_matrix, vstack
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import normalize
from nltk.corpus import stopwords
import traceback

# show all columns
pd.set_option('display.max_columns', None)


class ContentBasedRecommender:
    MODEL_NAME = 'Content-Based'

    def __init__(self, items_df=None):
        self.items_df = items_df

    def get_model_name(self):
        return self.MODEL_NAME

    def _get_similar_items_to_user_profile(self, person_id, topn=1000, user_profiles=None, tfidf_matrix=None,
                                           item_ids=None):
        cosine_similarities = cosine_similarity(user_profiles[person_id], tfidf_matrix)
        similar_indices = cosine_similarities.argsort().flatten()[-topn:]
        similar_items = sorted([(item_ids[i], cosine_similarities[0, i]) for i in similar_indices],
                               key=lambda x: -x[1])
        return similar_items

    def recommend_items(self, user_id, items_to_ignore=[], topn=10, verbose=False, user_profiles=None,
                        tfidf_matrix=None, item_ids=None):
        similar_items = self._get_similar_items_to_user_profile(user_id, topn=topn, user_profiles=user_profiles,
                                                                tfidf_matrix=tfidf_matrix, item_ids=item_ids)
        similar_items_filtered = list(filter(lambda x: x[0] not in items_to_ignore, similar_items))

        recommendations_df = pd.DataFrame(similar_items_filtered,
                                          columns=['movie_id', 'recStrength']).drop_duplicates().sort_values(
            by='recStrength', ascending=False).head(topn)
        if verbose and self.items_df is not None:
            recommendations_df = recommendations_df.merge(self.items_df, how='left', on='movie_id')[
                ['recStrength', 'movie_id', 'title', 'genres']]
        return recommendations_df


def get_cb_recommendations(user_id, interactions_df, df):
    try:
        # remove movie_id in interactions_df that are not in df
        interactions_df = interactions_df[interactions_df['movie_id'].isin(df['movie_id'])]

        stopwords_list = stopwords.words('english')
        vectorizer = TfidfVectorizer(analyzer='word', ngram_range=(1, 2), min_df=0.003, max_df=0.5, max_features=5000,
                                     stop_words=stopwords_list)

        # Assuming 'movie_id' in df matches 'movie_id' in your example
        item_ids = df['movie_id'].tolist()
        # Concatenate text fields for TF-IDF vectorization
        tfidf_matrix = vectorizer.fit_transform(
            df['title'] + " " + df['director'] + " " + df['cast'] + " " + df['genres'] + " " + df['description'])
        tfidf_feature_names = vectorizer.get_feature_names_out()

        # Adjusted function to fetch item profiles
        def get_item_profile(item_id):
            idx = item_ids.index(item_id)
            return tfidf_matrix[idx:idx + 1]

        # Adjusted function to aggregate item profiles
        def get_item_profiles(ids):
            return vstack([get_item_profile(x) for x in ids])

        # Refactored function to build user profiles based on interactions
        def build_user_profile(person_id, interactions_df):
            interactions_person_df = interactions_df[interactions_df['user_id'] == person_id]
            if interactions_person_df.empty:
                return np.zeros((1, tfidf_matrix.shape[1]))

            user_item_profiles = get_item_profiles(interactions_person_df['movie_id'].tolist())
            user_item_strengths = np.array(interactions_person_df['points']).reshape(-1, 1)
            user_profile_vector = np.sum(user_item_profiles.multiply(user_item_strengths), axis=0) / np.sum(
                user_item_strengths)

            # Convert user_profile_vector to a numpy array if it's not already
            if isinstance(user_profile_vector, csr_matrix):
                user_profile_vector = user_profile_vector.toarray()

            # convert user_profile_vector to a numpy array with np.asarray
            user_profile_vector = np.asarray(user_profile_vector).reshape(-1)
            user_profile_norm = normalize(user_profile_vector.reshape(1, -1))

            return user_profile_norm

        # Function to build profiles for all users
        def build_users_profiles():
            user_profiles = {}
            for person_id in interactions_df['user_id'].unique():
                user_profiles[person_id] = build_user_profile(person_id, interactions_df)
            return user_profiles

        user_profiles = build_users_profiles()

        # Instantiate and use the recommender
        content_based_recommender_model = ContentBasedRecommender(df)

        # check if the user_id is in the interactions_df
        if user_id not in interactions_df['user_id'].unique():
            # raise ValueError(f'User ID {user_id} not found in interactions_df')
            print(f'User ID {user_id} not found in interactions_df')
            cb_flag = False
            # show available user_id (5)
            unique_list = interactions_df['user_id'].unique()
            print(f'Available user_id: {unique_list}')
            # give one from unique_list
            user_id = unique_list[0]
            print(f'User ID {user_id} is used instead')
            recommended_items_df = pd.DataFrame()
        else:
            # # Get top 10 recommendations for the user
            # recommended_items_df = content_based_recommender_model.recommend_items(user_id=user_id, topn=10, verbose=True)
            #
            # print("Recommended Items for User ID:", user_id)
            # # print(recommended_items_df)

            # Example: Assuming you have a way to fetch items the user has already interacted with
            items_to_ignore = interactions_df[interactions_df['user_id'] == user_id]['movie_id'].tolist()

            # Now call recommend_items with items_to_ignore
            recommended_items_df = content_based_recommender_model.recommend_items(user_id=user_id,
                                                                                   items_to_ignore=items_to_ignore,
                                                                                   topn=10,
                                                                                   verbose=True,
                                                                                   user_profiles=user_profiles,
                                                                                   tfidf_matrix=tfidf_matrix,
                                                                                   item_ids=item_ids)

            # print("Recommended Items for User ID:", user_id)
            # print(recommended_items_df)

            cb_flag = True

    except Exception as e:
        print(e)
        traceback.print_exc()
        cb_flag = False
        recommended_items_df = pd.DataFrame()

    return recommended_items_df

