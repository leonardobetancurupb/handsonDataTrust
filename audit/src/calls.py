import requests
import json
import time
import hashlib

# address = http://audit-app:5000
address = "http://localhost:5000"

# address = "http://54.197.173.166:5000"


log_format = {
  'type': "CREATE",
  "from": "1",
  "to": "Person",
  "content" : {
    "idUser":"1",
        "description":"Creating new person",
        "datetime":"17/07/2024 12:54",
        "creationStructure":{
            "id":"1",
            "name": "Luisa",
            "documentID": "123456789",
            "password":"*******",
            "city":"Medellin",
            "cellphone": "9876543210",
            "email": "john.doe@example.com",
            "role": ["Holder"]
          }
    }
}


def send_log(type,content,source,destination):

  url = address+"/response"
  
  payload = {
      
    "type" : type,
    "from" : source,
    "to"   : destination,
    "content" : content
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

  response = requests.request("POST", url, headers=headers, data=json.dumps(payload))

  return response.text

# print(send_log(type,description,source,destination)) 

def validate_log():
    
  url = address+"/validate"
  
  payload = {}

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

  return data

# print(validate_log())

def validate_log_id(id):

  url = address+"/validate/id"
  
  payload = {
    'log_id' : id
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

  return data

# print(validate_log_id(5))

def validate_log_range(start_id, end_id):

  url = address+"/validate/range"
  
  payload = {
    'start_id' : start_id,
    'end_id' : end_id
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

  return data

# print(validate_log_range(2,4))

def search_logs_by_date(initial_date, final_date):
  
  url = address+"/search/date"
  
  payload = {
    'initial_date' : initial_date,
    'final_date' : final_date
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
  #log_list = list(data.values())

  return data

# print(search_logs_by_date("2024-06-01", "2024-06-19"))


def search_logs_by_key(key, value):

  url = address+"/search/key"
  
  payload = {
    'key' : key,
    'value' : value
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

  return data

# print(search_logs_by_key("type", "query"))

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

# print(get_last_logs(10))

def get_all_logs():

  url = address+"/all"
  
  payload = {}

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

# print(get_all_logs())

def get_all_logs_user(user):

  url = address+"/all/user"
  
  payload = {
    'user' : user
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
  strdict = response.json().replace('"', "'")
  dict = json.loads(strdict.replace("'", '"'))

  return dict

# print(get_all_logs_user("Admin"))


## FUNCTIONS FOR FRONTEND

def search_by_structure(struct):

  url = address+"/search/struct"
  
  payload = struct

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

  return data

def get_all_types():

  url = address+"/types"
  payload = {}

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

  return data

#print(get_all_types())

#CALL FOR Echarts

def get_logs_date_user(user):
  url = address+"/chart/user"
  
  payload = {
    'user' : user
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
  strdict = response.json().replace('"', "'")
  dict = json.loads(strdict.replace("'", '"'))

  return dict

#print(get_logs_date_user("user_1"))

def get_logs_date():
  url = address+"/chart/all"
  
  payload = {}

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
  strdict = response.json().replace('"', "'")
  dict = json.loads(strdict.replace("'", '"'))

  return dict

#print(get_logs_date())