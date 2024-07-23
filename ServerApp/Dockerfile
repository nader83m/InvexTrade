FROM python:3.8.0

WORKDIR /app

COPY . /app

RUN apt-get update
# RUN apt-get install -y apt-utils
# RUN apt-get install -y libgl1-mesa-glx
# RUN apt-get update && apt-get install -y cmake

ENV NGINX_WORKER_PROCESSES auto
ENV NGINX_WORKER_CONNECTIONS 1024
ENV NGINX_WORKER_OPEN_FILES 1024

RUN pip install --upgrade pip
RUN pip install -r app/requirements.txt
CMD ["uwsgi", "app.ini"]

