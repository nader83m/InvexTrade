from pymongo import MongoClient


client = MongoClient("mongodb://localhost:27017/") # your connection string
db = client["InvexDB"]
users_collection = db["users"]
guestUser = { 'username': "guest", 'password': "7ti17G8!I5o8" }
guestUser["password"] = hashlib.sha256(guestUser["password"].encode("utf-8")).hexdigest()  # encrpt password
doc = users_collection.find_one({"username": new_user["username"]})  # check if user exist
if not doc:
    new_user['guest'] = True
    new_user['email_verified'] = False
    new_user['tel_verified'] = False

    users_collection.insert_one(new_user)
