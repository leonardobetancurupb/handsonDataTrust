import json
import hashlib
import time
import requests
import pandas as pd

address = "http://audit:5000"

struct = {
    "source" : "Admin",
    "type" : "CREATE"
}

def search_logs_by_struct(struct):

    df = pd.read_json("src/audit.txt", lines=True)

    condition = pd.Series([True] * len(df))
    
    for key, value in struct.items():
        condition &= (df[key] == value)

    result = df[condition]

    result.to_csv("result.csv")
    # x = result.to_json(orient='records', date_format='iso')
    # return x

search_logs_by_struct(struct)