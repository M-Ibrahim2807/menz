from django.db import models
from django.conf import settings


class Payment(models.Model):
    order = models.OneToOneField(
        'orders.Order',
        on_delete=models.CASCADE,
        related_name='payment_record'   # <--- FIX ADDED
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    screenshot = models.ImageField(upload_to='payments/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='pending')

    def __str__(self):
        return f"Payment for Order {self.order.id} - {self.status}"
