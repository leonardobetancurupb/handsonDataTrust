from flask import Flask
import json

app = Flask(__name__)


@app.route('/')
def index():
    return "This is a Flask webservice"


class user:
    def __init__(self, name, email):
        self.name = name
        self.email = email


users = [
    user("John", "john@hotmail.com"),
    user("Jane", "jane@yahoo.com")
]

@app.get('/users')
def get_users():
    return json.dumps(users, default=vars)