from django.contrib import admin
from .models import Order, OrderItem, RefundRequest
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    readonly_fields = ('product_name', 'price_at_purchase', 'quantity')
    can_delete = False
    extra = 0
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'order_date', 'status', 'total_amount')
    inlines = [OrderItemInline]
    readonly_fields = ('order_date','total_amount')
@admin.register(RefundRequest)
class RefundRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'user', 'status', 'created_at')
    list_filter = ('status',)
