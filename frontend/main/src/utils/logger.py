
import numpy as np
import pandas as pd
import requests
import json
import time
import hashlib
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import FileSystemStorage

from datetime import datetime, timedelta

class Operations:
    
    @staticmethod
    def send_log(type,content,source,destination):
        url = "http://127.0.0.1:5000/response"
        payload = {
            "type" : type,
            "from" : source,
            "to"   : destination,
            "content" : content #TODO json -> cosas importantes que se crean necesarias
        }

        def generate_token():
            token = "PALABRA"+str(payload)+time.strftime("%Y-%m-%d", time.localtime())
            token = hashlib.sha256(token.encode()).hexdigest()
            return token

        generated_token = generate_token()

        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {generated_token}'
        }
        print(json.dumps(payload))
        #response = requests.request("POST", url, headers=headers, data=json.dumps(payload))

        #return response.text
        
address= "http://127.0.0.1:5000"
        
def get_last_logs(count):
    url = address+"/recent"
    
    payload = {
        'count' : count
    }

    def generate_token():
        token = "PALABRA"+str(payload)+time.strftime("%Y-%m-%d", time.localtime())
        token = hashlib.sha256(token.encode()).hexdigest()
        return token

    generated_token = generate_token()

    headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {generated_token}'
    }

    response = requests.request("GET", url, headers=headers, data=json.dumps(payload))
    data = response.json()
    log_list = list(data.values())

    return log_list

    # return json.loads(response.text)

def generate_token(payload):
    current_date = datetime.now()
    new_date = current_date + timedelta(days=1)
    formatted_date = new_date.strftime("%Y-%m-%d")

    token = "PALABRA"+str(payload)+formatted_date
    token = hashlib.sha256(token.encode()).hexdigest()
    return token


def get_all_logs():
    url = "http://127.0.0.1:5000/all"
    payload = {}

    def generate_token():
        current_date = datetime.now()
        formatted_date = current_date.strftime("%Y-%m-%d")

        token = "PALABRA"+str(payload)+formatted_date
        token = hashlib.sha256(token.encode()).hexdigest()
        return token

    generated_token = generate_token()
    print(generated_token)
    headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {generated_token}'
    }

    response = requests.request("GET", url, headers=headers, data=json.dumps(payload))
    data = response.json()
    log_list = list(data.values())

    return log_list


def get_all_types():

  url = address+"/types"
  payload = {}

  def generate_token():
    current_date = datetime.now()
    formatted_date = current_date.strftime("%Y-%m-%d")

    token = "PALABRA"+str(payload)+formatted_date
    token = hashlib.sha256(token.encode()).hexdigest()
    return token

  generated_token = generate_token()

  headers = {
  'Content-Type': 'application/json',
  'Authorization': f'Bearer {generated_token}'
  }

  response = requests.request("GET", url, headers=headers, data=json.dumps(payload))

  data = response.json()

  return data

print(get_all_types())

def get_user_consumers(user):

  url = address+"/consumers/user"
  
  payload = {
    'user' : user
  }

  def generate_token():
    current_date = datetime.now()
    formatted_date = current_date.strftime("%Y-%m-%d")

    token = "PALABRA"+str(payload)+formatted_date
    token = hashlib.sha256(token.encode()).hexdigest()
    return token

  generated_token = generate_token()

  headers = {
  'Content-Type': 'application/json',
  'Authorization': f'Bearer {generated_token}'
  }

  response = requests.request("GET", url, headers=headers, data=json.dumps(payload))
#   strdict = response.json().replace('"', "'")
#   dict = json.loads(strdict.replace("'", '"'))

  return response.json()

# print(get_user_consumers("user_1"))

#CALL FOR Echarts

def get_logs_date_user(user):
  url = address+"/chart/user"
  
  payload = {
    'user' : user
  }

  def generate_token():
    current_date = datetime.now()
    new_date = current_date + timedelta(days=1)
    formatted_date = new_date.strftime("%Y-%m-%d")

    token = "PALABRA"+str(payload)+formatted_date
    token = hashlib.sha256(token.encode()).hexdigest()
    return token

  generated_token = generate_token()

  headers = {
  'Content-Type': 'application/json',
  'Authorization': f'Bearer {generated_token}'
  }

  response = requests.request("GET", url, headers=headers, data=json.dumps(payload))
#   strdict = response.json().replace('"', "'")
#   dict = json.loads(strdict.replace("'", '"'))

  return response.json()

# print(get_logs_date_user("user_1"))

def get_logs_date():
  url = address+"/chart/all"
  
  payload = {}

  def generate_token():

    current_date = datetime.now()
    new_date = current_date + timedelta(days=1)
    formatted_date = current_date.strftime("%Y-%m-%d")

    token = "PALABRA"+str(payload)+formatted_date
    token = hashlib.sha256(token.encode()).hexdigest()
    return token

  generated_token = generate_token()

  headers = {
  'Content-Type': 'application/json',
  'Authorization': f'Bearer {generated_token}'
  }

  response = requests.request("GET", url, headers=headers, data=json.dumps(payload))
  try:
      # Decodificar la cadena JSON manualmente
      data = json.loads(response.text)
     
     
      if isinstance(data, list) and all(isinstance(i, dict) for i in data):
          df = pd.DataFrame(data)
          print(df)
          # Convertir timestamp a epoch time en milisegundos
          df['timestamp'] = pd.to_datetime(df['timestamp'], utc=True).astype(np.int64) // 1000000
          # Convertir DataFrame a la lista deseada
          result = df[['timestamp', 'actions']].values.tolist()
          return result
      else:
          print("Error: Data is not in the expected format.")
          return None
  except json.JSONDecodeError:
      print("Error decoding JSON response.")
      return None
  except ValueError as e:
      print(f"ValueError: {e}")
      return None
# print(get_logs_date())