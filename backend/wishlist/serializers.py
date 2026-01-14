from rest_framework import serializers
from .models import Wishlist, WishlistItem
from product.serializers import ClothingProductSerializer

class WishlistItemSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()

    class Meta:
        model = WishlistItem
        fields = ['id', 'product']

    def get_product(self, obj):
        return ClothingProductSerializer(obj.product, context=self.context).data

class WishlistSerializer(serializers.ModelSerializer):
    items = WishlistItemSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'items']
