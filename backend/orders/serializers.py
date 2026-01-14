from rest_framework import serializers
from .models import Order, OrderItem, RefundRequest
from product.serializers import ClothingProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'price_at_purchase', 'quantity']
        read_only_fields = ['product', 'product_name', 'price_at_purchase']

    def get_product(self, obj):
        return ClothingProductSerializer(obj.product, context=self.context).data

class CreateOrderItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    # Expose derived fields: payment verification and track status
    payment_verification_status = serializers.SerializerMethodField()
    track_order_status = serializers.SerializerMethodField()
    # Make `status` and `payment_status` reflect track/payment values for the frontend
    status = serializers.SerializerMethodField()
    payment_status = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'user', 'order_date', 'status', 'payment_status', 'total_amount', 'shipping_address', 'items', 'loyalty_points_earned', 'payment_verification_status', 'track_order_status']
        read_only_fields = ['id', 'user', 'order_date', 'status', 'payment_status', 'total_amount', 'items', 'loyalty_points_earned']

    def get_payment_verification_status(self, obj):
        # If a Payment record exists (OneToOne relation named 'payment_record'), return its status
        payment = getattr(obj, 'payment_record', None)
        if payment is None:
            return 'waiting'
        return getattr(payment, 'status', 'waiting')

    def get_track_order_status(self, obj):
        # Track status is '-' by default, becomes 'shipping' when payment is approved
        payment = getattr(obj, 'payment_record', None)
        if payment and getattr(payment, 'status', '').lower() == 'approved':
            return 'shipping'
        # allow storing an explicit track field on the order in future
        return getattr(obj, 'track_order_status', '-')

    def get_status(self, obj):
        # Return the track_order_status as the exposed `status` for frontend consistency
        return getattr(obj, 'track_order_status', '-')

    def get_payment_status(self, obj):
        # Mirror payment verification status into the `payment_status` field
        payment = getattr(obj, 'payment_record', None)
        if payment is None:
            return 'waiting'
        return getattr(payment, 'status', 'waiting')

class RefundRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = RefundRequest
        fields = ['id', 'order', 'user', 'reason', 'created_at', 'status', 'admin_note']
        read_only_fields = ['id', 'user', 'created_at', 'status', 'admin_note']
