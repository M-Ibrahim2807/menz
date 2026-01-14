import os
import sys
import django
import requests
from io import BytesIO
from PIL import Image

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from orders.models import Order
from payments.models import Payment

User = get_user_model()

# Get or create test user and order
user = User.objects.first()
if not user:
    print("No user found. Create a user first.")
    sys.exit(1)

# Get or create test order
order = Order.objects.filter(user=user).first()
if not order:
    order = Order.objects.create(user=user, total_amount=100, status='pending')
    print(f"Created test order: {order.id}")

# Create a test image
img = Image.new('RGB', (100, 100), color='red')
img_bytes = BytesIO()
img.save(img_bytes, format='PNG')
img_bytes.seek(0)

# Test payment creation via REST API
print("\n--- Testing Payment Upload via API ---")

# Get JWT token
login_url = 'http://127.0.0.1:8000/api/auth/login/'
login_data = {
    'email': user.email,
    'password': 'password123'  # Change if different
}

try:
    login_resp = requests.post(login_url, json=login_data)
    print(f"Login status: {login_resp.status_code}")
    
    if login_resp.status_code == 200:
        token = login_resp.json().get('tokens', {}).get('access')
        if token:
            # Now try to upload payment
            upload_url = 'http://127.0.0.1:8000/api/payments/create/'
            headers = {'Authorization': f'Bearer {token}'}
            files = {
                'screenshot': ('test.png', img_bytes, 'image/png'),
                'order': (None, str(order.id))
            }
            
            upload_resp = requests.post(upload_url, headers=headers, files=files)
            print(f"Upload status: {upload_resp.status_code}")
            print(f"Upload response: {upload_resp.json()}")
        else:
            print("No token in login response")
            print(login_resp.json())
    else:
        print(f"Login failed: {login_resp.json()}")
except Exception as e:
    print(f"Error: {e}")
