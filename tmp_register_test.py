import json
import urllib.request
import urllib.error
import sys

url = 'http://127.0.0.1:8000/api/auth/register/'
payload = {
    'username': 'test_local_user_1',
    'email': 'localtest+1@example.com',
    'password': 'Password123!',
    'password_confirm': 'Password123!'
}

data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'}, method='POST')

try:
    with urllib.request.urlopen(req, timeout=20) as resp:
        body = resp.read().decode('utf-8')
        print('STATUS', resp.status)
        print(body)
except urllib.error.HTTPError as e:
    try:
        body = e.read().decode('utf-8')
    except Exception:
        body = ''
    print('HTTPERROR', e.code)
    print(body)
except Exception as e:
    print('ERROR', str(e))

sys.exit(0)
