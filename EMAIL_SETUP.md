# Email System Setup - Complete Documentation

## Overview
Complete email system has been implemented for the Menz Fashion e-commerce platform with both backend (Django) and frontend (React) integration.

## What's Been Set Up

### 1. Django Backend Configuration

#### Settings (`backend/settings.py`)
Email configuration has been added with the following settings:
- **Email Backend**: `django.core.mail.backends.smtp.EmailBackend`
- **Email Host**: `smtp.gmail.com`
- **Email Port**: `587`
- **Use TLS**: `True`
- **Default From Email**: `itsmenzwardrobe@gmail.com`
- **Admin Email**: `itsmenzwardrobe@gmail.com`

Email credentials are read from environment variables (.env file):
- `EMAIL_HOST_USER` - defaults to 'itsmenzwardrobe@gmail.com'
- `EMAIL_HOST_PASSWORD` - from .env (needs to be set)

#### Contact App Created
Location: `/backend/contact/`

**Files Created:**
- `__init__.py` - App initialization
- `apps.py` - App configuration
- `models.py` - ContactMessage model
- `serializers.py` - ContactMessageSerializer for API
- `views.py` - ContactMessageViewSet with email sending logic
- `urls.py` - API routes
- `admin.py` - Django admin configuration
- `tests.py` - Test file (empty, ready for tests)
- `migrations/` - Database migrations (0001_initial.py created)

**ContactMessage Model Fields:**
- `name` (CharField) - Sender's name
- `email` (EmailField) - Sender's email
- `phone` (CharField, optional) - Sender's phone
- `subject` (CharField) - Message subject
- `message` (TextField) - Message content
- `created_at` (DateTimeField) - Auto-set timestamp
- `is_read` (BooleanField) - Read status (default: False)

**API Endpoints:**
- `POST /api/contact/submit/` - Submit contact form
- `GET /api/contact/messages/` - List all messages (admin)
- `GET /api/contact/messages/{id}/` - Get single message (admin)

**Email Functionality:**
When a contact form is submitted:
1. Message is saved to database
2. Email sent to admin (itsmenzwardrobe@gmail.com) with full message details
3. Confirmation email sent to user thanking them for contacting

### 2. Frontend Integration

#### React ContactUs Component (`sda-frontend/src/components/pages/ContactUs/ContactUs.jsx`)

**Updates Made:**
- Form submission now makes API call to backend
- Added loading state while sending
- Added error message display
- Form fields cleared on successful submission
- Success message displays for 5 seconds

**Form Data Submitted:**
- `name` - Full name (required)
- `email` - Email address (required)
- `phone` - Phone number (optional)
- `subject` - Message subject (required)
- `message` - Message content (required)

**API Call Details:**
```javascript
POST http://localhost:8000/api/contact/submit/
Headers: Content-Type: application/json
Body: { name, email, phone, subject, message }
```

#### Styling Updates (`ContactUs.css`)
- Added `.error-message` class with red alert styling
- Updated `.submit-btn` with disabled state styling
- Button shows "Sending..." text while loading
- Button is disabled and grayed out during submission

### 3. Database Setup

**Migration Status:**
- Created: `contact/migrations/0001_initial.py`
- Applied: `migrate contact` ✓

**Database Table Created:**
- Table: `contact_contactmessage`
- Ready to store contact submissions

### 4. Environment Configuration

#### .env File (`backend/.env`)
Added email configuration:
```
EMAIL_HOST_USER=itsmenzwardrobe@gmail.com
EMAIL_HOST_PASSWORD=your_gmail_app_password_here
```

## How to Complete Setup

### IMPORTANT: Gmail App Password Setup

You CANNOT use your regular Gmail password with SMTP. You must create a Gmail App Password:

**Steps:**
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click "Security" in the left menu
3. Enable "2-Step Verification" if not already enabled
4. Go back to Security and find "App passwords"
5. Select "Mail" and "Windows Computer" (or your device type)
6. Google will generate a 16-character password
7. Copy that password and update `.env` file:
   ```
   EMAIL_HOST_PASSWORD=<paste-16-char-password-here>
   ```

### After Setup

1. **Start Django development server:**
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Start React development server** (in another terminal):
   ```bash
   cd sda-frontend
   npm run dev
   ```

3. **Test the contact form:**
   - Go to Contact Us page
   - Fill in the form
   - Submit
   - Check that:
     - Success message appears
     - Email received at itsmenzwardrobe@gmail.com
     - Message appears in Django admin at /admin/contact/contactmessage/

## Email Flow Diagram

```
User fills Contact Form (React)
           ↓
Frontend validates form data
           ↓
POST request to /api/contact/submit/
           ↓
Django receives and validates with ContactMessageSerializer
           ↓
ContactMessage saved to database
           ↓
Email sent to admin (itsmenzwardrobe@gmail.com)
           ↓
Confirmation email sent to user's provided email
           ↓
JSON response sent back to frontend
           ↓
Success message displays to user
```

## Files Modified/Created Summary

### Created Files (9 total):
1. `backend/contact/__init__.py`
2. `backend/contact/apps.py`
3. `backend/contact/models.py`
4. `backend/contact/serializers.py`
5. `backend/contact/views.py`
6. `backend/contact/urls.py`
7. `backend/contact/admin.py`
8. `backend/contact/tests.py`
9. `backend/contact/migrations/__init__.py`
10. `backend/contact/migrations/0001_initial.py` (auto-generated)

### Modified Files (3 total):
1. `backend/backend/settings.py` - Added email config and contact app
2. `backend/backend/urls.py` - Added contact app routes
3. `backend/.env` - Added email credentials
4. `sda-frontend/src/components/pages/ContactUs/ContactUs.jsx` - Added API integration
5. `sda-frontend/src/components/pages/ContactUs/ContactUs.css` - Added error styling

## Testing the System

### Test Email Submission

```bash
curl -X POST http://localhost:8000/api/contact/submit/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+92 300 1234567",
    "subject": "Test Message",
    "message": "This is a test message"
  }'
```

Expected Response:
```json
{
  "success": true,
  "message": "Your message has been sent successfully. We will get back to you soon.",
  "data": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+92 300 1234567",
    "subject": "Test Message",
    "message": "This is a test message",
    "created_at": "2024-01-15T10:30:00Z",
    "is_read": false
  }
}
```

## Admin Interface

Access contact messages via Django admin:
1. Go to `http://localhost:8000/admin/`
2. Login with your admin credentials
3. Navigate to "Contact Messages"
4. View all submissions with filters and search

## Troubleshooting

### Emails Not Sending?

1. **Check .env file** - Make sure EMAIL_HOST_PASSWORD is set with Gmail App Password
2. **Gmail App Password** - Not regular password, must be 16-character generated password
3. **2-Step Verification** - Must be enabled on Gmail account
4. **Django Logs** - Check terminal for error messages
5. **Firewall** - Make sure port 587 is not blocked

### Connection Refused Error?

- Make sure Django server is running: `python manage.py runserver`
- Check that frontend is making requests to `http://localhost:8000`

### Form Not Submitting?

- Open browser console (F12) to check for errors
- Verify all required fields are filled
- Make sure backend server is running

## Next Steps

1. ✅ Set Gmail App Password in .env
2. ✅ Test contact form submission
3. ✅ Verify emails are received
4. Optional: Customize email templates in views.py
5. Optional: Add email templates/HTML formatting
6. Optional: Add file upload to contact form
7. Optional: Add reCAPTCHA verification
