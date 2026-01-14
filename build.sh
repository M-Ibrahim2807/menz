#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Navigate to backend directory for Django commands
cd backend

# Collect static files
python manage.py collectstatic --no-input

# Apply migrations
python manage.py migrate
