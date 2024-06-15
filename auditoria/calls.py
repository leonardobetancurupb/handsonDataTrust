import requests
import json
import time
import hashlib


# Example data
type = "query"
source = "user_1"
destination = "rds_db_1"
description = {"query":"SELECT * from TABLE personas"}


# Example search format

search_info = {
    "initial_date" : "2024-06-01",
    "final_date" : "2024-06-13",
    "type" : type,
    "user" : "user_1"
  }

def send_log(type,content,source,destination):

  url = "http://127.0.0.1:5000/response"
  
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

def validate_log():
    
  url = "http://127.0.0.1:5000/validate"
  
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

  return response.text

def search_logs(data):
  
  url = "http://127.0.0.1:5000/search"
  
  payload = data

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

  return response.text

# Sample calls

# print(send_log(type,description,source,destination))

# print(validate_log())

print(search_logs(search_info))
