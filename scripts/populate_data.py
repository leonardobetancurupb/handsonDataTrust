import requests
import random
from datetime import datetime
import json
import string
import os
import pandas as pd
import openpyxl
import sys


url="http://54.197.173.166:8000/"
endpoints={
    "register":url+"registers/",
    "login":url+"login/",
    "holders":url+"api/holders/",
    "consumers":url+"api/consumers/",
    "admin":url+"api/admin/",
    "schema":url+"api/schema/",
    "category":url+"api/category/",
    "politicas":url+"api/policy/",
    "saveData":url+"saveData/"
}

def poblateDBUsers(urlUser, urlHolder, urlConsumer, urlAdmin, nUsers):
    """
    Poblate the database with different users, consumers, admin y users like subjects

    Args:
        urlUser:str Endpoint to register users.
        urlHolder:str Endpoint to register subjects.
        urlConsumer:str Endpoint to register consumers.
        urlAdmin:str Endpoint to register one admin.
        nUsers:int How many users wants to create.
    """
    headers = {
    'Content-Type': 'application/json'
    }
    password="user"
    role=['holder',"consumer"]
    lstUsers=[]
    lstUserHolder=[]
    lstUserConsumer=[]
    payloadUserAdmin={
        "username":"admin",
        "password":"admin",
        "role":"admin"
    }
    rUserAdmin= requests.post(urlUser,headers=headers, data=json.dumps(payloadUserAdmin))
    if 200<=rUserAdmin.status_code<300:
        payloadAdmin={
            "idPerson":"0"
        }
        rAdmin= requests.post(urlAdmin, data=json.dumps(payloadAdmin), headers=headers)
        if 200<=rAdmin.status_code<300:
            pass
        else:
            print( "rAdmin "+str(rAdmin.status_code))
    else:
        return print("rUserAdmin "+str(rUserAdmin.status_code))
    countHolder=0
    countConsumer=0
    for i in range(1,nUsers+1):
        randomNumber=random.randint(0, 1)
        roleSelected=role[randomNumber]
        payload={
            "username":"user_"+str(i),
            "password":password,
            "role":roleSelected
        }
        lstUsers.append(payload)
        rUser= requests.post(urlUser, data=json.dumps(payload), headers=headers)
        if 200<=rUser.status_code<300:
            if payload["role"]=="holder":
                payloadHolder={
                    "idPerson":str(i)
                }
                rHolder=requests.post(urlHolder, data=json.dumps(payloadHolder), headers=headers)
                if 200<=rHolder.status_code<300:
                    lstUserHolder.append(str(countHolder))
                    countHolder+=1
                else:
                    return "rHolder "+str(rHolder.status_code)
            else:
                payloadConsumer={
                    "idPerson":str(i),
                    "company":"company_"+str(i),
                    "nit":str(i)+"170702"
                }
                rConsumer=requests.post(urlConsumer, data=json.dumps(payloadConsumer), headers=headers)
                if 200<=rConsumer.status_code<300:
                    lstUserConsumer.append(str(countConsumer))
                    countConsumer+=1
                else:
                    return "rConsumer "+str(rConsumer.status_code)
        else:
            return "rUser "+str(rUser.status_code)
    return lstUsers, lstUserHolder, lstUserConsumer

def poblateSchema(headers):
    """    
    Poblate the database with different Schemas

    Args:
        headers: Headers with tokens to create schema
    """
    schemasCreated=[]
    payload={        
        "name":"insurance",
        "structure":"",
        "fieldToEncrypt":"",
        "description":""
    }
    name=["Insurance","BankPersonal"]
    structures=["name address age sex bmi children smoker region charges","name address Age Experience Income ZIP_Code Family CCAvg Education Mortgage Personal_Loan Securities_Account CD Account Online CreditCard"]
    fieldToEncrypt=[['name','address'],['ZIP_Code']]
    description=["Insurance data","Bank Personal data"]
    for i in range(len(name)):
        payload["name"]=name[i]
        payload["structure"]=structures[i]
        payload["fieldToEncrypt"]=fieldToEncrypt[i]
        payload["description"]=description[i]

        rSchema=requests.post(endpoints['schema'], data=json.dumps(payload), headers=headers)
        if 200<=rSchema.status_code<300:
            schemasCreated.append({"idSchema":str(i),"structures":structures[i],"fieldToEncrypt":fieldToEncrypt[i],"name":name[i]})
        else:
            print("rSchema: "+str(rSchema.status_code))
    return schemasCreated

def poblateCategory(headers):
    """    
    Poblate the database with different Categories

    Args:
        headers: Headers with tokens to create category
    """
    category=""
    categoriesCreated=[]
    payload={
        "category":category
    }
    categories=['Medical','Financial']
    for i in range(len(categories)):
        payload["category"]=categories[i]
        rCategory=requests.post(endpoints["category"], data=json.dumps(payload), headers=headers)
        if 200<=rCategory.status_code<300:
            categoriesCreated.append({"idCategory":str(i),"category":categories[i]})
        else:
            print("rcategory: "+str(rCategory.status_code))
    return categoriesCreated

def poblatePolicy(headers):
    """    
    Poblate the database with different Policies

    Args:
        headers: Headers with tokens to create Policy
    """
    policyCreated=[]
    dateNow=datetime.today().date()
    newDate=dateNow.month+4
    date=dateNow.replace(month=newDate)
    payload={
        "name":"",
        "description":"",
        "idCategory":"",
        "estimatedTime":str(date),
        "Value":""
    }
    name=['for devops','for machine learning']
    description=["for devops and processing","for machine learning and ia"]
    idCategory=["0","1"]
    value=["0.20","0.30"]

    for i in range(len(name)):
        payload["name"]=name[i]
        payload["description"]=description[i]
        payload["idCategory"]=idCategory[i]
        payload["Value"]=value[i]

        rPolicy=requests.post(endpoints["politicas"], data=json.dumps(payload), headers=headers)
        if 200<=rPolicy.status_code<300:
            policyCreated.append({"idPolicy":str(i),"name":name[i],"idCategory":idCategory,"value":value[i]})
        else:
            print("rPolicy: "+str(rPolicy.status_code))
    return policyCreated
    
def generateDataRandom():
    """
        generate random name and address data.
    """
    nombre = ' '.join([random.choice(string.ascii_letters) for _ in range(10)]).title()
    direccion = ' '.join([random.choice(string.ascii_letters) for _ in range(20)]).title()
    return nombre, direccion

def poblateConsumption(lstConsumers, lstData):
    """    
    Poblate the database with different consumption from consumers to data subject

    Args:
        lstConsumers:list list of consumers objects
        lastData:list list of data objects from the subjects
    """
    headers = {
        'Content-Type': 'application/json'
        }
    for consumer in lstConsumers:
        randomNroData=random.randint(1, len(lstData)-1)
        copylstData=lstData
        lstDataIdSchema1Policy0=[]
        lstDataIdSchema1Policy1=[]
        lstDataIdSchema0Policy0=[]
        lstDataIdSchema0Policy1=[]
        dataId=""
        idSchema=""
        idPolicy=""
        
        for i in range(randomNroData):
            randomData=random.randint(0, len(lstData)-1)
            dataId=copylstData[randomData]['id']
            idSchema=copylstData[randomData]['idSchema']
            idPolicy=copylstData[randomData]['idPolicy']
            if int(idSchema) == 0 and dataId not in lstDataIdSchema0Policy0 and int(idPolicy)==0:
                lstDataIdSchema0Policy0.append(dataId)
            elif int(idSchema) == 0 and dataId not in lstDataIdSchema0Policy1 and int(idPolicy)==1:
                lstDataIdSchema0Policy1.append(dataId)
            elif int(idSchema) == 1 and dataId not in lstDataIdSchema1Policy0 and int(idPolicy)==0:
                lstDataIdSchema1Policy0.append(dataId)
            elif int(idSchema) == 1 and dataId not in lstDataIdSchema1Policy1 and int(idPolicy)==1:
                lstDataIdSchema1Policy1.append(dataId)
        payload={
                "idConsumer":str(consumer),
                "lstDataId": [],
                "idSchema":"",
                "idPolicy":""
            }
        
        if len(lstDataIdSchema0Policy0)!=0:
            payload["lstDataId"]=lstDataIdSchema0Policy0
            payload["idPolicy"]="0"
            payload["idSchema"]="0"
            r = requests.post(f'{url}sign/', data=json.dumps(payload), headers=headers)
            if 200<=r.status_code<300:
                print("Ok1")        
            else:
                print("1error lstData schema 0 - policy 0: "+str(r.status_code))
        
        if len(lstDataIdSchema0Policy1)!=0:
            payload["idSchema"]="0"
            payload["idPolicy"]="1"
            payload["lstDataId"]=lstDataIdSchema0Policy1
            res = requests.post(f'{url}sign/', data=json.dumps(payload), headers=headers)
            if 200<=res.status_code<300:
                print("Ok2")        
            else:
                print("2error lstData schema 0 - policy 1: "+str(res.status_code))
        
        if len(lstDataIdSchema1Policy0)!=0:
            payload["idSchema"]="1"
            payload["idPolicy"]="0"
            payload["lstDataId"]=lstDataIdSchema1Policy0
            resp = requests.post(f'{url}sign/', data=json.dumps(payload), headers=headers)                        
            if 200<=resp.status_code<300:
                print("Ok3")
            else:
                print("3error lstData schema 1 - policy 0: "+str(resp.status_code))

        if len(lstDataIdSchema1Policy1)!=0:
            payload["idSchema"]="1"
            payload["idPolicy"]="1"
            payload["lstDataId"]=lstDataIdSchema1Policy1
            respo = requests.post(f'{url}sign/', data=json.dumps(payload), headers=headers)                                                    
            if 200<=respo.status_code<300:
                print("Ok4")
            else:
                print("4error lstData schema 1 - policy 1: "+str(respo.status_code))
        print("Consumer: "+str(consumer)+": Ok")

def poblateData(schemasCreated,categoriesCreated, policiesCreated, lstUserHolder):
    """    
    Poblate the database with different data subject

    Args:
        schemasCreated:list list of schemas objects created
        categoriesCreated:list list of categories objects created
        policiesCreated:list list of policies objects created
        lstUserHolder:list list of subjects objects created
    """
    count=0
    lstData=[]
    for holder in lstUserHolder:
       
        for schema in schemasCreated:
            workbook = openpyxl.Workbook()
            headers = schema['structures'].split(" ")
            worksheet = workbook.active
            for col_num, header in enumerate(headers, start=1):
                worksheet.cell(row=1, column=col_num, value=header)
           
            path="filesBot/"+schema['name']+".csv"
            df=pd.read_csv(path,delimiter=",")
            nroFilasDf=df.shape[0]
            randomData=random.randint(1, nroFilasDf-1)
            name, address = generateDataRandom()
            new_row = [name, address] + list(df.iloc[randomData])
            worksheet.append(new_row)
            workbook.save("dataGenerated/"+schema['name']+str(holder)+".xlsx")
            
            randomPolicy=random.randint(0, len(policiesCreated)-1)
           
            idCategory=""
            for category in categoriesCreated:
                if schema['name']=="Insurance" and category['category']=="Medical":
                    idCategory=category['idCategory']
                elif schema['name']=="BankPersonal" and category['category']=="Financial":
                    idCategory=category['idCategory']
            
            files={'archivo':open("dataGenerated/"+schema['name']+str(holder)+".xlsx",'rb')}
            workbook.close()
            data={
                'idCategory': idCategory,
                'format': "xlsx",
                'idSchema': schema['idSchema'],
                'idPolicy': policiesCreated[randomPolicy]['idPolicy']
            }
            response = requests.post(f'{url}saveData/holder/{holder}/', files=files, data=data)
           
            if response.status_code == 200:
                lstData.append({"id":count,"idCategory":idCategory,"idSchema":schema['idSchema'],"idPolicy":policiesCreated[randomPolicy]['idPolicy'], "idHolder":holder})
                count+=1
                print('send file OK')
            else:
                print('error:', response.text)
    return lstData

def deleteFilesGenerated(path):
  """delete all files from a path

  Args:
    path: path from carpet when files generated are.
  """

  for archivo in os.listdir(path):
    path_completa = os.path.join(path, archivo)
    if os.path.isfile(path_completa):
      os.remove(path_completa)
      print(f"file deleted: {path_completa}")



def poblateDBSchema(urlLogin,lstUsers, lstUserHolder, lstUserConsumer):
    """    
        Integrator function to poblate the database

    Args:
        urlLogin:str url for login users.
        lstUsers:list list of users objects created
        lstUserHolder:list list of subjects objects created
        lstUserConsumer:list list of consumers objects created
    """
    headersc = {
  'Content-Type': 'application/json'
}
    payloadLogin={
        "username":"admin",
        "password":"admin"
    }
    rAuth=requests.post(urlLogin, data=json.dumps(payloadLogin), headers=headersc)
    if 200<=rAuth.status_code<300:
        tokens=rAuth.json()
        tokenAccess=tokens['access']
        bearer="Bearer "+tokenAccess
        headers = {
            
            'Content-Type': 'application/json',
            'Authorization': bearer
        }
        categoriesCreated=poblateCategory(headers)
        schemasCreated=poblateSchema(headers)
        policiesCreated=poblatePolicy(headers)
        lstData=poblateData(schemasCreated,categoriesCreated, policiesCreated, lstUserHolder)
        poblateConsumption(lstUserConsumer,lstData)
    else:
        print( "rAuth: "+str(rAuth.status_code))
    return


def main():
    if len(sys.argv) != 2:
        print("Error: only need one argument")
        sys.exit(1)
    try:
        numero = int(sys.argv[1])
    except ValueError:
        sys.exit(1)
    lstUsers, lstUserHolder, lstUserConsumer=poblateDBUsers(endpoints['register'],endpoints["holders"],endpoints["consumers"],endpoints["admin"],numero)
    poblateDBSchema(endpoints["login"],lstUsers, lstUserHolder, lstUserConsumer)
    deleteFilesGenerated("dataGenerated")
    return

if __name__ == "__main__":
    main()
