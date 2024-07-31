#poblar esquemas
#poblar categorias
#poblar politicas

#poblar de documentos a los holders
#poblar de firmas de consumers a documentos de holders
import requests
import random
from datetime import datetime
import json
import string
import os
import pandas as pd
import openpyxl
import csv
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
    
def generar_datos_aleatorios():
    """Genera datos aleatorios para nombre, cédula y dirección."""
    nombre = ' '.join([random.choice(string.ascii_letters) for _ in range(10)]).title()
    direccion = ' '.join([random.choice(string.ascii_letters) for _ in range(20)]).title()
    return nombre, direccion

def crear_datos_dummies(origen,destino):
    df=pd.read_csv(origen,delimiter=",")
    dfHeaders=df.columns.tolist()
    dfHeaders.extend(['Nombre', 'Cédula', 'Dirección'])  
    for index, row in df.iterrows():
        nombre, cedula, direccion = generar_datos_aleatorios()
        nueva_fila = pd.DataFrame([[*row, nombre, cedula, direccion]], columns=dfHeaders)
        nombre_archivo = f"Bank_Personal_Loan_Modelling.xlsx"
        os.makedirs(f"{destino}\\{index}", exist_ok=True)
        ruta_completa = f"{destino}\\{index}\\{nombre_archivo}"
        nueva_fila.to_excel(ruta_completa, index=False)

def poblateConsumption(lstConsumidores, lstData):
    '''
    {
    "idConsumer":"2",
    "lstDataId":["4","5"],
    "idSchema":"1"
    }
    '''
    headers = {
        'Content-Type': 'application/json'
        }
    #por consumidor
    for consumer in lstConsumidores:
        #numero aleatorio entre 1 y la cantidad de data almacenada-1
        randomNroData=random.randint(1, len(lstData)-1)
        copylstData=lstData
        lstDataIdSchema1Policy0=[]
        lstDataIdSchema1Policy1=[]
        lstDataIdSchema0Policy0=[]
        lstDataIdSchema0Policy1=[]
        dataId=""
        idSchema=""
        idPolicy=""
        #desde 0 hasta el numero aleatorio
        for i in range(randomNroData):
            #numero aleatorio entre 0 y la cantidad de data almacenada -1
            randomData=random.randint(0, len(lstData)-1)
            #el numero aleatorio es el index del cual agarraré el id de ese index y el esquema correspondiente
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
        #si hay ids almacenados en esquema 1 y esquema 2 entonces...
        if len(lstDataIdSchema0Policy0)!=0:
            payload["lstDataId"]=lstDataIdSchema0Policy0
            payload["idPolicy"]="0"
            payload["idSchema"]="0"
            r = requests.post(f'http://54.197.173.166:8000/sign/', data=json.dumps(payload), headers=headers)
            if 200<=r.status_code<300:
                print("Ok1")        
            else:
                print("1error lstData schema 0 - policy 0: "+str(r.status_code))
        
        if len(lstDataIdSchema0Policy1)!=0:
            payload["idSchema"]="0"
            payload["idPolicy"]="1"
            payload["lstDataId"]=lstDataIdSchema0Policy1
            res = requests.post(f'http://54.197.173.166:8000/sign/', data=json.dumps(payload), headers=headers)
            if 200<=res.status_code<300:
                print("Ok2")        
            else:
                print("2error lstData schema 0 - policy 1: "+str(res.status_code))
        
        if len(lstDataIdSchema1Policy0)!=0:
            payload["idSchema"]="1"
            payload["idPolicy"]="0"
            payload["lstDataId"]=lstDataIdSchema1Policy0
            resp = requests.post(f'http://54.197.173.166:8000/sign/', data=json.dumps(payload), headers=headers)                        
            if 200<=resp.status_code<300:
                print("Ok3")
            else:
                print("3error lstData schema 1 - policy 0: "+str(resp.status_code))

        if len(lstDataIdSchema1Policy1)!=0:
            payload["idSchema"]="1"
            payload["idPolicy"]="1"
            payload["lstDataId"]=lstDataIdSchema1Policy1
            respo = requests.post(f'http://54.197.173.166:8000/sign/', data=json.dumps(payload), headers=headers)                                                    
            if 200<=respo.status_code<300:
                print("Ok4")
            else:
                print("4error lstData schema 1 - policy 1: "+str(respo.status_code))
        print("Consumer: "+str(consumer)+": Ok")

def poblateData(schemasCreated,categoriesCreated, policiesCreated, lstUserHolder, ):
    #crear archivo con plantillas escogida aleatoriamente, el archivo con 
    #datos sacados ordenadamente del csv proporcionado
    #y posteriormente subirlo con el id del holder actual
    '''
        {
            "idCategory":"",
            "format":"",
            "idSchema":"",
            "idPolicy":"",
        }
    '''
    # Define your headers as a list
    #por holder en los holders creados
    count=0
    lstData=[]
    for holder in lstUserHolder:
        #por esquema en los esquemas creados
        for schema in schemasCreated:
            workbook = openpyxl.Workbook()
            headers = schema['structures'].split(" ")
            worksheet = workbook.active
            for col_num, header in enumerate(headers, start=1):
                worksheet.cell(row=1, column=col_num, value=header)
            #leer excel con ese nombre
            path="handsonDataTrust/scripts/filesBot/"+schema['name']+".csv"
            df=pd.read_csv(path,delimiter=",")
            nroFilasDf=df.shape[0]
            randomData=random.randint(1, nroFilasDf-1)
            nombre, direccion = generar_datos_aleatorios()
            new_row = [nombre, direccion] + list(df.iloc[randomData])
            worksheet.append(new_row)
            workbook.save("handsonDataTrust/scripts/dataGenerated/"+schema['name']+str(holder)+".xlsx")
            
            randomPolicy=random.randint(0, len(policiesCreated)-1)
            #request
            idCategory=""
            for category in categoriesCreated:
                if schema['name']=="Insurance" and category['category']=="Medical":
                    idCategory=category['idCategory']
                elif schema['name']=="BankPersonal" and category['category']=="Financial":
                    idCategory=category['idCategory']
            
            files={'archivo':open("handsonDataTrust/scripts/dataGenerated/"+schema['name']+str(holder)+".xlsx",'rb')}
            workbook.close()
            data={
                'idCategory': idCategory,
                'format': "xlsx",
                'idSchema': schema['idSchema'],
                'idPolicy': policiesCreated[randomPolicy]['idPolicy']
            }
            response = requests.post(f'http://54.197.173.166:8000/saveData/holder/{holder}/', files=files, data=data)
            # Maneja la respuesta
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
    deleteFilesGenerated("handsonDataTrust/scripts/dataGenerated")
    return

if __name__ == "__main__":
    main()
