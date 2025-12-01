from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_cart, name='cart-detail'),               # GET cart
    path('add/', views.add_to_cart, name='cart-add'),           # POST add item
    path('update/<int:item_id>/', views.update_cart_item, name='cart-update'),  # PUT/PATCH
    path('remove/<int:item_id>/', views.remove_cart_item, name='cart-remove'),  # DELETE
    path('clear/', views.clear_cart, name='cart-clear'),        # DELETE
]
