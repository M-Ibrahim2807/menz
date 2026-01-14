from rest_framework import serializers
from .models import ClothingProduct, Review
import os
from django.conf import settings

# Generic review serializer
class ReviewSerializer(serializers.ModelSerializer):
    user_email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = Review
        fields = ['id', 'user', 'user_email', 'product_type', 'product_id', 'rating', 'comment', 'created_at']
        read_only_fields = ['user']

# Clothing Product Serializer
class ClothingProductSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ClothingProduct
        fields = ['id', 'name', 'description', 'price', 'stock', 'category', 'image', 'image_url', 'reviews']

    def get_reviews(self, obj):
        reviews = Review.objects.filter(product_type='clothing', product_id=obj.id)
        return ReviewSerializer(reviews, many=True, context=self.context).data

    def get_image_url(self, obj):
        request = self.context.get('request') if isinstance(self.context, dict) else None
        if not obj.image or not hasattr(obj.image, 'url'):
            return None
        
        if request is not None:
            try:
                return request.build_absolute_uri(obj.image.url)
            except Exception:
                pass
        
        site_url = getattr(settings, 'SITE_URL', None) or os.getenv('SITE_URL') or os.getenv('VITE_API_BASE')
        if site_url:
            site = site_url.rstrip('/')
            path = obj.image.url if obj.image.url.startswith('/') else f'/{obj.image.url}'
            return f"{site}{path}"
        
        return obj.image.url

# Alias for backwards compatibility with other apps
ProductSerializer = ClothingProductSerializer
