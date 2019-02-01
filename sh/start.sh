#!/bin/bash
set -e

export PYTHONUNBUFFERED=true
export FLASK_APP=/app/backend/src/main.py

pip install --user sqlalchemy sqlite_web

webpack --config webpack.config.js

(
  cd /app/backend/src
  nodemon --delay 2000ms --exec "flask run --port 3002" --ext py
) &

# wait a bit for flask to start
sleep 1

node index.js
