from django.contrib import admin
from .models import ClothingProduct, Review  # only existing models

@admin.register(ClothingProduct)
class ClothingProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'stock')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'product_type', 'product_id', 'rating', 'created_at')
