#!/usr/bin/env bash

set -o errexit

pip install -r requirements.txt

pythhon manage.py collectstatic --noinput
python manage.py makemigrations
python manage.py migrate