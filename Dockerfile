FROM alpine:latest
ENV PGDATA=/var/lib/postgresql/data
RUN apk update &&\
  apk add --no-cache py3-pip postgresql &&\
  pip3 install django psycopg2-binary djangorestframework markdown django-filter &&\
  mkdir /var/lib/postgresql/data &&\
  chown -R postgres /var/lib/postgresql/data &&\
  chmod 0700 /var/lib/postgresql/data &&\
  mkdir /run/postgresql &&\
  chown -R postgres /run/postgresql &&\
  chmod 0700 /run/postgresql
USER postgres
RUN initdb /var/lib/postgresql/data &&\
  echo "host all  all    0.0.0.0/0  md5" >> /var/lib/postgresql/data/pg_hba.conf &&\
  echo "listen_addresses='*'" >> /var/lib/postgresql/data/postgresql.conf &&\
  pg_ctl start -D /var/lib/postgresql/data &&\
  psql -U postgres -c 'create database busstops;'
USER root
