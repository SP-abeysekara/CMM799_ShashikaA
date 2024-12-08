import pandas as pd

# show all columns
pd.set_option('display.max_columns', None)

interactions_df = pd.read_csv('../database_final/interactions.csv')
item_df = pd.read_csv('../database_final/item_features.csv')
context_df = pd.read_csv('../database_final/context_data.csv')

print("interactions_df")
print(interactions_df.head(5))
# null values in each attribute
print(interactions_df.isnull().sum())
print()

print("item_df")
print(item_df.head(5))
# null values in each attribute
print(item_df.isnull().sum())
print()

print("context_df")
print(context_df.head(5))
# null values in each attribute
print(context_df.isnull().sum())
print()


# Fill missing string values with 'Unknown'
item_df['director'].fillna('Unknown', inplace=True)
item_df['cast'].fillna('Unknown', inplace=True)
item_df['country'].fillna('Unknown', inplace=True)
item_df['production_company'].fillna('Unknown', inplace=True)

# Impute numerical missing values with the median
item_df['runtime'].fillna(item_df['runtime'].median(), inplace=True)

# For audience rating and count, use median imputation
item_df['audience_rating'].fillna(item_df['audience_rating'].median(), inplace=True)
item_df['audience_count'].fillna(item_df['audience_count'].median(), inplace=True)

# Convert dates to datetime format (assuming the original_release_date does not have a time component)
item_df['original_release_date'] = pd.to_datetime(item_df['original_release_date'], errors='coerce')
item_df['streaming_release_date'] = pd.to_datetime(item_df['streaming_release_date'], errors='coerce')

# Handle missing dates by dropping or imputation based on your model's needs
# Example: Drop rows where either date is missing (for simplicity)
item_df.dropna(subset=['original_release_date', 'streaming_release_date'], inplace=True)

# print("interactions_df")
# print(interactions_df.head(3))
# # null values in each attribute
# print(interactions_df.isnull().sum())
# print()
#
# print("item_df")
# print(item_df.head(3))
# # null values in each attribute
# print(item_df.isnull().sum())
# print()
#
# print("context_df")
# print(context_df.head(3))
# # null values in each attribute
# print(context_df.isnull().sum())
# print()

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import nltk

# Download NLTK data (if needed)
nltk.download('stopwords')
nltk.download('wordnet')

# Initialize lemmatizer
lemmatizer = WordNetLemmatizer()

# Sample text cleaning and lemmatization function
def clean_and_lemmatize(text):
    # Lowercasing
    text = text.lower()
    # Tokenization (splitting text into words)
    words = text.split()
    # Removing stopwords
    words = [word for word in words if word not in stopwords.words('english')]
    # Lemmatization
    words = [lemmatizer.lemmatize(word) for word in words]
    # Rejoin words into a single string
    return ' '.join(words)

# Applying the cleaning function to the description column
item_df['cleaned_description'] = item_df['description'].apply(clean_and_lemmatize)

# Vectorizing cleaned descriptions with TF-IDF
tfidf_vectorizer = TfidfVectorizer(max_features=1000)  # Limit features for simplicity
tfidf_matrix = tfidf_vectorizer.fit_transform(item_df['cleaned_description'])

# remove description and rename cleaned_description to description
item_df.drop(columns=['description'], inplace=True)
item_df.rename(columns={'cleaned_description': 'description'}, inplace=True)

# save
interactions_df.to_csv('interactions.csv', index=False)
item_df.to_csv('item_features.csv', index=False)
context_df.to_csv('context_data.csv', index=False)
