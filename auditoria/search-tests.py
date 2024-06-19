import pandas as pd
import time
from datetime import datetime

def search_logs_by_date(file, initial_date, final_date):

    if isinstance(initial_date, str):
        initial_date = pd.to_datetime(initial_date)
    if isinstance(final_date, str):
        final_date = pd.to_datetime(final_date)

    df = pd.read_json(file, lines=True, convert_dates={'timestamp': False})

    result = df[(df['timestamp'] >= initial_date) & (df['timestamp'] <= final_date)]
    
    result.to_csv('result.csv', index=False)
    
    return 

def search_logs(file, key, value):

    df = pd.read_json(file, lines=True)

    result = df[df[key]==value]
    result.to_csv('result.csv', index=False)
    return 

search_logs_by_date("audit.txt", "2024-06-01", "2024-06-19")


