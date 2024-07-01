import requests

api_url = "http://backend:5000/"
response = requests.get(api_url)
print(response)



api_url = "http://backend:5000/users"
response = requests.get(api_url)
print(response)
print(response.content)

