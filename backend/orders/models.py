from django.db import models
from django.conf import settings
from product.models import Product
User = settings.AUTH_USER_MODEL
class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending Payment'),
        ('paid', 'Paid'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    order_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    shipping_address = models.TextField(blank=True, null=True)
    loyalty_points_earned = models.IntegerField(default=0)

    def calculate_total(self):
        total = sum(item.calculate_subtotal() for item in self.items.all())
        self.total_amount = total
        self.save(update_fields=['total_amount'])
        return self.total_amount

    def __str__(self):
        return f"Order #{self.id} by {self.user}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    product_name = models.CharField(max_length=255)
    price_at_purchase = models.DecimalField(max_digits=12, decimal_places=2)
    quantity = models.PositiveIntegerField()

    def calculate_subtotal(self):
        return float(self.price_at_purchase) * float(self.quantity)

    def __str__(self):
        return f"{self.product_name} x {self.quantity}"


class RefundRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('processed', 'Processed'),
    )

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='refunds')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='pending', choices=STATUS_CHOICES)
    admin_note = models.TextField(blank=True, null=True)
    def __str__(self):
        return f"Refund {self.id} for order {self.order.id} - {self.status}"
