from django.urls import path
from . import views

urlpatterns = [
    path('', views.ProductListView.as_view(), name='product-list'),
    path('<int:id>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('category/<str:category>/', views.ProductByCategoryView.as_view(), name='product-category'),
    path('<int:product_id>/reviews/', views.product_reviews, name='product-reviews'),
    path('<int:product_id>/reviews/add/', views.add_review, name='add-review'),
]
