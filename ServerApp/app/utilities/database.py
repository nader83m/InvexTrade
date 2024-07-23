from pymongo import MongoClient


client = MongoClient("mongodb://localhost:27017/") # your connection string
db = client["InvexDB"]
