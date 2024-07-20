import json
import hashlib
import time
import requests
import pandas as pd

def get_consumers(user):


  df = pd.read_json("src/audit.txt", lines=True)
  df = df[df['source']==user]
  result = df[df['type']=="UPDATE CONSUMPTION"]

  x = result.to_json(orient='records', date_format='iso')
  return x



print(get_consumers("user_1"))