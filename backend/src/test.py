import json
import hashlib
import time
import requests

address = "http://audit:5000"

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

  return response.text

print(get_last_logs(10))