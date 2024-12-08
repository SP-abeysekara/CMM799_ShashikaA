import csv
import json
from datetime import datetime

# Input and output files
csv_file = 'test_set.csv'  # Replace with your CSV file path
json_file = 'output.json'  # Output JSON file path


# Field mappings from CSV to Schema
def map_fields(row):
    return {
        "content_type": row.get("content_type", "").strip(),
        "title": row.get("title", "").strip(),
        "cast": row.get("cast", "").strip(),
        "country": row.get("country", "").strip(),
        "date_added": parse_date(row.get("date_added")),
        "duration": row.get("duration", "").strip(),
        "listed_in": row.get("listed_in", "").strip(),
        "description": row.get("description", "").strip(),
        "movie_name": row.get("movie_name", "").strip(),
        "movie_info": row.get("movie_info", "").strip(),
        "content_rating": row.get("content_rating", "").strip(),
        "genres": row.get("genres", "").strip(),
        "authors": row.get("authors", "").strip(),
        "original_release_date": parse_date(row.get("original_release_date")),
        "streaming_release_date": parse_date(row.get("streaming_release_date")),
        "runtime": parse_number(row.get("runtime")),
        "production_company": row.get("production_company", "").strip(),
        "audience_status": row.get("audience_status", "").strip(),
        "audience_rating": parse_number(row.get("audience_rating")),
        "audience_count": parse_number(row.get("audience_count")),
        "movie_id": parse_number(row.get("movie_id", 0), is_required=True),
    }


# Helper functions for data transformation
def parse_date(date_str):
    if date_str:
        try:
            return datetime.strptime(date_str.strip(), "%Y-%m-%d").isoformat()
        except ValueError:
            print(f"Invalid date: {date_str}")
    return None


def parse_number(num_str, is_required=False):
    try:
        return int(num_str) if num_str else (0 if is_required else None)
    except ValueError:
        print(f"Invalid number: {num_str}")
        return 0 if is_required else None


# Convert CSV to JSON
with open(csv_file, mode='r') as file:
    csv_reader = csv.DictReader(file)

    # Transform rows to match schema
    data = [map_fields(row) for row in csv_reader]

# Write JSON to output file
with open(json_file, mode='w') as file:
    json.dump(data, file, indent=2)

print(f"CSV converted to JSON successfully and saved to {json_file}!")
