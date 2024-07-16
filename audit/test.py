import json
import hashlib
import time
import requests
import pandas as pd

address = "http://audit:5000"

# struct = {
#     "source" : "Admin",
#     "type" : "CREATE"
# }

# def search_logs_by_struct(struct):

#     df = pd.read_json("src/audit.txt", lines=True)

#     condition = pd.Series([True] * len(df))
    
#     for key, value in struct.items():
#         condition &= (df[key] == value)

#     result = df[condition]

#     x = result.to_json(orient='records', date_format='iso')
#     return x

# search_logs_by_struct(struct)

def get_all_types():
  
  df = pd.read_json("src/audit.txt", lines=True)

  create = (df['type'] == "CREATE").sum()
  get = (df['type'] == "GET").sum()
  get_id = (df['type'] == "GET_ID").sum()
  update = (df['type'] == "UPDATE").sum()
  delete = (df['type'] == "DELETE").sum()

  result = {
    "CREATE" : create,
    "GET" : get,
    "GET_ID" : get_id,
    "UPDATE" : update,
    "DELETE" : delete
  }
  return result

print(get_all_types())

