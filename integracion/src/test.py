import os
import pymongo

myclient = pymongo.MongoClient("mongodb://db:27017/", username=os.getenv('MONGO_USERNAME'), password=os.getenv('MONGO_PASSWORD'))

mydb = myclient["mydatabase"]
print(myclient.list_database_names())   # Not created until we insert something

mycol = mydb['primos']
print(mydb.list_collection_names())     # Not created until data inserted

primos = [
    {'2': 2},
    {'3': 3},
    {'5': 5}
]

r = mycol.insert_many(primos)
print(r.inserted_ids)

