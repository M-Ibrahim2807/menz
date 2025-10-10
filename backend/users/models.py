from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('customer','customer'),
        ('admin','admin')
    )


    user_type=models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='customer')
    phone=models.CharField(max_length=11, blank=True)
    address=models.CharField(blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    email=models.EmailField(unique=True)

    
    def __str__(self):
        return self.email

     
  
