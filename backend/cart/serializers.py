from rest_framework import serializers
from .models import Cart, CartItem
from product.serializers import ClothingProductSerializer

class CartItemSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'subtotal']
        read_only_fields = ['id', 'product', 'subtotal']

    def get_product(self, obj):
        """Serialize the product from GenericForeignKey. Handle None gracefully."""
        try:
            product = obj.product
            if product is None:
                return None
            return ClothingProductSerializer(product, context=self.context).data
        except Exception:
            return None

    def get_subtotal(self, obj):
        """Calculate subtotal. Return 0 if product doesn't exist."""
        try:
            return obj.get_subtotal()
        except Exception:
            return 0


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total']
        read_only_fields = ['id', 'user', 'items', 'total']

    def get_total(self, obj):
        """Calculate cart total. Handle missing products gracefully."""
        try:
            return obj.get_total()
        except Exception:
            # Fallback: recalculate total manually
            total = 0
            for item in obj.items.all():
                try:
                    if item.product and hasattr(item.product, 'price'):
                        total += float(item.product.price) * item.quantity
                except Exception:
                    pass
            return total
