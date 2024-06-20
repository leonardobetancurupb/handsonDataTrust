import json
import time
import hashlib
import pandas as pd
from flask import Flask, jsonify, request
from datetime import datetime


# Function: Add log to file
def add_log(content, source, destination, type):

        # Last log reference needed for hashing validation
        last_log = get_last_log(file)

        if last_log:
            last_id = last_log['log_id']
            last_hash = last_log['actual_hash']
        else:
            last_id = 0
            last_hash = hashlib.sha256(str(time.time()).encode()).hexdigest()

        # Log structure
        log  = {
            "log_id" : last_id + 1,
            "timestamp" : time.time(),
            "source" : source,
            "destination" : destination,
            "type" : type,
            "description" : content,
            "last_hash" : last_hash
        }

        # Calculating actual hash and adding to log
        actual_hash = hashlib.sha256(str(log).encode()).hexdigest()
        log['actual_hash'] = actual_hash

        # Saving the log
        with open(file, 'a') as f:
            f.write(json.dumps(log) + '\n')

        print(f"log archived")

# Function: Get last log from file
def get_last_log(file):

    with open(file, 'r') as f:

        logs = f.readlines()
        if not logs:
            print("Empty file.")
            return None
        last_log = logs[-1]
        return json.loads(last_log)

# Functions to validate logs

def validate_log(file):

    with open(file, 'r') as f:

        logs = f.readlines()
        if not logs:
            print("Empty file.")
            return None
        
        last_hash = None
        
        for registry in logs:
            log = json.loads(registry)

            #validation on registered log equals calculated log
            registered_hash = log.pop('actual_hash')
            actual_hash = hashlib.sha256(str(log).encode()).hexdigest()

            if actual_hash != registered_hash:
                return f"Error on log: {log['log_id']}"
            
            #validation on previous hash 
            if registry != logs[0] and registry != logs[-1]:

                if last_hash != log['last_hash']:
                    return f"Error on log: {log['log_id']}"
            
            last_hash = actual_hash
        
        return "Consistent Log!"

def validate_log_by_id(file, id):

    with open(file, 'r') as f:

        logs = f.readlines()
        if not logs:
            print("Empty file.")
            return None
        
        for registry in logs:
            log = json.loads(registry)

            if id == log.get('log_id'):
                
                #validation on registered log equals calculated log
                registered_hash = log.pop('actual_hash')
                actual_hash = hashlib.sha256(str(log).encode()).hexdigest()

                if actual_hash != registered_hash:
                    return f"Error on log: {log['log_id']}"
        
        return "Consistent Log! (verified individually)"    

def validate_log_by_range(file,start_id, end_id):

    with open(file, 'r') as f:

        logs = f.readlines()
        if not logs:
            print("Empty file.")
            return None
        
        for registry in logs:
            log = json.loads(registry)
            log_id = log.get('log_id')

            if start_id <= log_id and log_id <= end_id:
                
                #validation on registered log equals calculated log
                registered_hash = log.pop('actual_hash')
                actual_hash = hashlib.sha256(str(log).encode()).hexdigest()

                if actual_hash != registered_hash:
                    return f"Error on log: {log['log_id']}"
        
        return "Consistent Log! (verified in a range of logs)"

# validate communication token

def validate_token(payload):

    content = json.loads(payload)
    auth_header = request.headers.get('Authorization')

    # Token validation process
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        print("Token: "+token)
    else:
        print("Token not found")
        return False

    text = "PALABRA"+str(content)+time.strftime("%Y-%m-%d", time.localtime())
    text = hashlib.sha256(text.encode()).hexdigest()

    if text == token:
        return True
    
    return False

# Search functions

def search_logs(file, key, value):

    df = pd.read_json(file, lines=True)

    result = df[df[key]==value]
    result.to_csv('result.csv', index=False)
    return 

def search_logs_by_date(file, initial_date, final_date):

    if isinstance(initial_date, str):
        initial_date = pd.to_datetime(initial_date)
    if isinstance(final_date, str):
        final_date = pd.to_datetime(final_date)

    df = pd.read_json(file, lines=True, convert_dates={'timestamp': False})

    result = df[(df['timestamp'] >= initial_date) & (df['timestamp'] <= final_date)]
    
    result.to_csv('result.csv', index=False)
    
    return 

app = Flask(__name__)

# Log file path
file = "audit.txt"

@app.route('/response', methods=['POST'])
def log_reply():


    payload = request.get_data(as_text=True)
    content = json.loads(payload)

    if validate_token(payload):

        add_log(content,content.pop('from'), content.pop('to'), content.pop('type'))

        response = {
            'auth': 'Token validated',
            'message': 'Log registered.'
        }

        return jsonify(response), 201

    else:

        response = {
            'auth': 'Invalid Token :(',
            'message': 'Unable to log.'
        }

        return jsonify(response), 401

@app.route('/validate', methods=['GET'])
def validation_reply():

    payload = request.get_data(as_text=True)

    if validate_token(payload):
    
        status = validate_log(file)

        response = {'auth' : 'Token validated', 'log_status' : status} 

    else: response = {'auth' : 'Invalid token :(', 'log_status' : " null "} 

    return jsonify(response), 201

@app.route('/validate/id', methods=['GET'])
def validation_id_reply():

    payload = request.get_data(as_text=True)

    if validate_token(payload):
    
        content = json.loads(payload)
        status = validate_log_by_id(file,content.pop('log_id'))

        response = {'auth' : 'Token validated', 'log_status' : status} 

    else: response = {'auth' : 'Invalid token :(', 'log_status' : " null "} 

    return jsonify(response), 201

@app.route('/validate/range', methods=['GET'])
def validation_range_reply():

    payload = request.get_data(as_text=True)

    if validate_token(payload):
    
        content = json.loads(payload)
        status = validate_log_by_range(file,content.pop('start_id'),content.pop('end_id'))

        response = {'auth' : 'Token validated', 'log_status' : status} 

    else: response = {'auth' : 'Invalid token :(', 'log_status' : " null "} 

    return jsonify(response), 201

@app.route('/search/key', methods=['GET'])
def search_key_reply():

    payload = request.get_data(as_text=True)
    
    if validate_token(payload):
        
        content = json.loads(payload)
        logs = search_logs(file, content.pop('key'), content.pop('value'))

        response = {'auth' : 'Token validated', 'response' : "Response loaded in result.csv"} 

    else: response = {'auth' : 'Invalid token :(', 'response' : " null "} 

    return jsonify(response), 201

@app.route('/search/date', methods=['GET'])
def search_date_reply():

    payload = request.get_data(as_text=True)
    
    if validate_token(payload):
        
        content = json.loads(payload)
        logs = search_logs_by_date(file, content.pop('initial_date'), content.pop('final_date'))

        response = {'auth' : 'Token validated', 'response' : "Response loaded in result.csv"} 

    else: response = {'auth' : 'Invalid token :(', 'response' : " null "} 

    return jsonify(response), 201



if __name__ == '__main__':
    from argparse import ArgumentParser

    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5000, type=int, help='port to listen on')
    args = parser.parse_args()
    port = args.port

    app.run(host='0.0.0.0', port=port)