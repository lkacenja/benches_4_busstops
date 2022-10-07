FROM ubuntu:latest
ENV TZ=US/Mountain
ENV PGDATA=/var/lib/postgresql/data
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone &&\
  apt-get update -y &&\
  apt-get install python3-pip systemd postgresql postgresql-contrib postgis -y &&\
  pip3 install django psycopg2-binary djangorestframework django-filter python-dotenv gunicorn whitenoise dj-database-url
USER postgres
ENV PATH="${PATH}:/var/lib/postgresql/.local/bin"
RUN service postgresql start &&\
  psql -U postgres -c 'CREATE EXTENSION postgis;' &&\
  psql -U postgres -c 'create database busstops;'
USER root
