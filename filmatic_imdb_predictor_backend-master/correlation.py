import os
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.preprocessing import LabelEncoder

# Concatenate all DataFrames into one
final_df = pd.read_csv("/concatenated_file.csv")

# Separate numerical and categorical columns
numerical_cols = final_df.select_dtypes(include=['float64', 'int64']).columns
categorical_cols = final_df.select_dtypes(include=['object', 'category']).columns

# 1. Correlation for Numerical Columns
print("\nCorrelation Matrix for Numerical Columns:")
correlation_matrix = final_df[numerical_cols].corr()
print(correlation_matrix['budget'])

# Plot heatmap for numerical columns
plt.figure(figsize=(10, 8))
sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm')
plt.title('Correlation Heatmap for Numerical Columns')
plt.show()

# 2. Handling Categorical Columns

# Convert categorical columns to numeric using LabelEncoder for correlation
label_encoder = LabelEncoder()

# Apply LabelEncoder to each categorical column
for col in categorical_cols:
    final_df[col] = label_encoder.fit_transform(final_df[col].astype(str))

# Now we can check correlations between budget and encoded categorical columns
print("\nCorrelation Matrix including Encoded Categorical Columns:")
correlation_matrix_with_categoricals = final_df.corr()
print(correlation_matrix_with_categoricals['budget'])

# Plot heatmap including categorical columns
plt.figure(figsize=(10, 8))
sns.heatmap(correlation_matrix_with_categoricals, annot=True, cmap='coolwarm')
plt.title('Correlation Heatmap for Numerical and Encoded Categorical Columns')
plt.show()

# 3. Boxplot to visualize relationships between budget and categorical columns
for col in categorical_cols:
    plt.figure(figsize=(10, 6))
    sns.boxplot(x=col, y='budget', data=final_df)
    plt.title(f'Boxplot of Budget vs {col}')
    plt.xticks(rotation=45)
    plt.show()

print("Correlation analysis complete!")
