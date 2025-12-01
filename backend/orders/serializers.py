from rest_framework import serializers
from .models import Order, OrderItem, RefundRequest
from product.serializers import ProductSerializer
from product.models import Product

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'price_at_purchase', 'quantity']
        read_only_fields = ['product', 'product_name', 'price_at_purchase']

class CreateOrderItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'order_date', 'status', 'total_amount', 'shipping_address', 'items', 'loyalty_points_earned']
        read_only_fields = ['id', 'user', 'order_date', 'status', 'total_amount', 'items', 'loyalty_points_earned']

class RefundRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = RefundRequest
        fields = ['id', 'order', 'user', 'reason', 'created_at', 'status', 'admin_note']
        read_only_fields = ['id', 'user', 'created_at', 'status', 'admin_note']
