install requirements
```pip install -r requirements.txt```

run initialize.py
```python initialize.py```

**After Initialization project, is done you need run below two files to start the scheduler and API server.**

run
```python scheduler.py```

run
```python scheduler_db.py```

run  
``uvicorn main:app --reload --port 8000``

You can use either online API or Offline API with top_n + user_id or movie_id or both.

```
{
  "movie_id": 550,
  "user_id": "6714ab333cce69b6334131b0",
  "top_n": 10
}