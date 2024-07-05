FROM python:3.12

WORKDIR /code

COPY ./requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# command: python -m flask --app demo1 run --host=0.0.0.0 --port=5000
