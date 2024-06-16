import requests
import json
import time
import hashlib
class Operations:
    @staticmethod
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
        print(json.dumps(payload))
        #response = requests.request("POST", url, headers=headers, data=json.dumps(payload))

        #return response.text
