# Email System - Quick Start Guide

## ⚡ IMMEDIATE ACTION REQUIRED

### 1. Set Gmail App Password
```
Steps:
1. Go to https://myaccount.google.com
2. Click "Security" (left menu)
3. Find "App passwords"
4. Select "Mail" + "Windows Computer"
5. Copy the 16-character password
6. Open backend/.env and update:
   EMAIL_HOST_PASSWORD=<paste-16-char-password>
7. Save and restart Django
```

## 🚀 Run the System

### Terminal 1 - Django Backend
```bash
cd "c:\Users\nas\OneDrive\Desktop\Fast\5th Semester\SDA (With Project)\sda-ecommerce\backend"
python manage.py runserver
```
Server will run at: `http://localhost:8000`

### Terminal 2 - React Frontend
```bash
cd "c:\Users\nas\OneDrive\Desktop\Fast\5th Semester\SDA (With Project)\sda-ecommerce\sda-frontend"
npm run dev
```
App will run at: `http://localhost:5173` (or similar)

## ✅ Test It Works

1. Open React app in browser
2. Navigate to **Contact Us** page
3. Fill in the form:
   - Name: Any name
   - Email: Your email address
   - Phone: Optional
   - Subject: Test message
   - Message: Testing email functionality
4. Click **Send Message**
5. You should see:
   - Green success message
   - Email received at itsmenzwardrobe@gmail.com (admin)
   - Confirmation email at your provided email address

## 📧 View Submissions

### In Django Admin
1. Go to: `http://localhost:8000/admin/`
2. Login with admin credentials
3. Click "Contact Messages"
4. View all submissions

### Via API (cURL)
```bash
curl http://localhost:8000/api/contact/messages/
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `backend/.env` | Email credentials |
| `backend/contact/models.py` | Database structure |
| `backend/contact/views.py` | Email sending logic |
| `sda-frontend/src/components/pages/ContactUs/ContactUs.jsx` | Contact form |

## 🔍 Debug Tips

### Check if server is running
```bash
curl http://localhost:8000/
```

### Test email in terminal
```bash
python manage.py shell
from django.core.mail import send_mail
send_mail('Test', 'Hello', 'itsmenzwardrobe@gmail.com', ['recipient@example.com'])
```

### View logs
Check terminal where Django is running for error messages

## ⚙️ Configuration Details

- **Email Service**: Gmail SMTP
- **Host**: smtp.gmail.com
- **Port**: 587
- **Security**: TLS enabled
- **From Email**: itsmenzwardrobe@gmail.com
- **Admin Email**: itsmenzwardrobe@gmail.com
- **Database Table**: contact_contactmessage

## 📝 What Each File Does

### Backend
- `models.py` - Defines what data is saved
- `serializers.py` - Converts data for API
- `views.py` - Handles incoming requests and sends emails
- `urls.py` - Routes API endpoints
- `admin.py` - Adds to Django admin interface

### Frontend
- `ContactUs.jsx` - Contact form page with API calls
- `ContactUs.css` - Styling for form and messages

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Connection refused" | Start Django: `python manage.py runserver` |
| Emails not sending | Update EMAIL_HOST_PASSWORD in .env |
| Can't find Contact page | Make sure React is running |
| Email auth failed | Use Gmail App Password (not regular password) |
| Form not submitting | Check browser console (F12) for errors |

## ✨ Form Behavior

When user submits:
1. ✓ Form fields validate
2. ✓ API call made to backend
3. ✓ "Sending..." shown on button
4. ✓ Message saved to database
5. ✓ Admin email sent
6. ✓ User confirmation email sent
7. ✓ Success message displayed
8. ✓ Form fields cleared

## 📊 Email Contents

### Email to Admin
- Sender's name, email, phone
- Subject line
- Full message
- Submission timestamp

### Email to User
- Thank you message
- Copy of their message
- Company contact info

---

**Everything is set up! Just add the Gmail App Password and test it out.** 🎉
