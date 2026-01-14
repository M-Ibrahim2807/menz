from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import Order, OrderItem, RefundRequest

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    fields = ('product_name', 'price_at_purchase', 'quantity', 'get_subtotal')
    readonly_fields = ('product_name', 'price_at_purchase', 'quantity', 'get_subtotal', 'content_type', 'object_id')
    can_delete = True
    extra = 0

    def get_subtotal(self, obj):
        return f"Rs {obj.calculate_subtotal():.2f}"
    get_subtotal.short_description = "Subtotal"

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_user_email', 'order_date', 'status', 'track_order_status', 'total_amount', 'get_item_count')
    list_filter = ('status', 'track_order_status', 'order_date')
    search_fields = ('user__email', 'user__username')
    inlines = [OrderItemInline]
    readonly_fields = ('order_date', 'total_amount', 'get_order_items_summary', 'track_order_status')
    fieldsets = (
        ('Order Information', {
            'fields': ('user', 'order_date', 'status', 'track_order_status', 'total_amount', 'loyalty_points_earned')
        }),
        ('Shipping Details', {
            'fields': ('shipping_address',)
        }),
        ('Items Summary', {
            'fields': ('get_order_items_summary',),
            'classes': ('wide',)
        }),
    )

    def get_user_email(self, obj):
        return obj.user.email
    get_user_email.short_description = "User Email"

    def get_item_count(self, obj):
        return obj.items.count()
    get_item_count.short_description = "Items"

    def get_order_items_summary(self, obj):
        items = obj.items.all()
        if not items:
            return "No items in this order"
        
        html = '<table style="width:100%; border-collapse: collapse;">'
        html += '<tr style="background-color: #f0f0f0; border: 1px solid #ddd;"><th style="padding: 8px; border: 1px solid #ddd;">Product</th><th style="padding: 8px; border: 1px solid #ddd;">Price</th><th style="padding: 8px; border: 1px solid #ddd;">Quantity</th><th style="padding: 8px; border: 1px solid #ddd;">Subtotal</th></tr>'
        
        for item in items:
            html += f'<tr style="border: 1px solid #ddd;"><td style="padding: 8px; border: 1px solid #ddd;">{item.product_name}</td><td style="padding: 8px; border: 1px solid #ddd;">Rs {item.price_at_purchase}</td><td style="padding: 8px; border: 1px solid #ddd;">{item.quantity}</td><td style="padding: 8px; border: 1px solid #ddd;">Rs {item.calculate_subtotal():.2f}</td></tr>'
        
        html += f'<tr style="background-color: #f0f0f0; border: 1px solid #ddd; font-weight: bold;"><td colspan="3" style="padding: 8px; border: 1px solid #ddd;">Total:</td><td style="padding: 8px; border: 1px solid #ddd;">Rs {obj.calculate_total():.2f}</td></tr>'
        html += '</table>'
        return mark_safe(html)
    get_order_items_summary.short_description = "Order Items"

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'product_name', 'price_at_purchase', 'quantity', 'get_subtotal')
    list_filter = ('order__order_date', 'order__status')
    search_fields = ('product_name', 'order__id', 'order__user__email')
    readonly_fields = ('product_name', 'price_at_purchase', 'quantity', 'content_type', 'object_id')

    def get_subtotal(self, obj):
        return f"Rs {obj.calculate_subtotal():.2f}"
    get_subtotal.short_description = "Subtotal"

@admin.register(RefundRequest)
class RefundRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'user', 'status', 'created_at')
    list_filter = ('status',)
