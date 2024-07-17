import requests
import json
import time
import hashlib
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import FileSystemStorage



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
        
        
def get_last_logs(count):
    address= "http://54.197.173.166:5000"
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

