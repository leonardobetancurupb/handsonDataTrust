import json
import hashlib
import time
import requests
import pandas as pd

def get_logs_date():


  df = pd.read_json("src/audit.txt", lines=True)
  user_logs = df
  user_logs['timestamp'] = pd.to_datetime(user_logs['timestamp'])
  registers_per_day = user_logs.groupby(user_logs['timestamp'].dt.date).size()
  registers_per_day = registers_per_day.reset_index(name='actions')

  x = registers_per_day.to_json(orient='records', date_format='iso')
  return x



print(get_logs_date())