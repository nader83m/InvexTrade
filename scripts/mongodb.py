import pymongo
import hashlib

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["InvexDB"]
mycol = mydb["users"]

myquery = { "username": "nadir" }
new = {
  "email": "nadiribrahimpur@gmail.com"
}
password = hashlib.sha256("123".encode("utf-8")).hexdigest()
new["password"] = password
newvalues = { "$set": new }


result = mycol.update_one(myquery, newvalues)
print(result.modified_count)
#print "customers" after the update:
for x in mycol.find():
  print(x)
