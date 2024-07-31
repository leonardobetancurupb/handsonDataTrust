import requests
import time

def send_post_request():
    
    url = 'http://backend:8000/verifyDate'
    
    headers = {
        'Content-Type': 'application/json'
    }
    
    response = requests.post(url, headers=headers)
    
    if response.status_code == 200:
        print('POST request successful')
    else:
        print(f'Failed to send POST request: {response.status_code}, {response.text}')

if __name__ == "__main__":
    while True:
      time.sleep(60)
      send_post_request()
      time.sleep(24 * 60 * 60)