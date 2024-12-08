import requests

url = "http://127.0.0.1:8002/predict_xgboost"

# movie_data = {
#     "runtime": 120.0,
#     "release_year": 2023,
#     "genres": "Action",
#     "production_companies": "Marvel Studios",
#     "production_countries": "United States",
#     "original_language": "en",
#     "directors": "Jon Watts",
#     "main_characters": "Spider-Man",
#     "keywords": "superhero"
# }

movie_data = {
    "runtime": 169,
    "release_year": 0,
    "genres": "",
    "production_companies": "legendary pictures, syncopy, lynda obst productions",
    "production_countries": "united kingdom, united states of america",
    "original_language": "en",
    "directors": "christopher nolan",
    "main_characters": "matthew mcconaughey, anne hathaway, jessica chastain",
    "keywords": "rescue, future, spacecraft, race against time, artificial intelligence (a.i.), nasa, time warp, dystopia, expedition, space travel, wormhole, famine, black hole, quantum mechanics, family relationships, space, robot, astronaut, scientist, single father, farmer, space station, curious, space adventure, time paradox, thoughtful, time-manipulation, father daughter relationship, 2060s, cornfield, time manipulation, complicated"
}

response = requests.post(url, json=movie_data)
print(response.json())
