needed:
- Python 3.8 or higher
- PostgreSQL
- Git


1.clone the repository
 
git clone https://github.com/levi426/sda-ecommerce.git
cd sda-ecommerce
#for virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux


pip install -r requirements.txt

Database setup
Install PostgreSQL if not already installed
Create a database named ecommerce_db
Copy backend/.env.example to backend/.env
Update backend/.env with your PostgreSQL credentials:

env
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_PORT=5432  #depends upon ur installation
SECRET_KEY=your-django-secret-key-here
DEBUG=True

cd backend
python manage.py migrate
python manage.py runserver