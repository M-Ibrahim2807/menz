from django.urls import path
from . import views

urlpatterns = [
    path('place/', views.place_order, name='place-order'),
    path('<int:order_id>/', views.view_order, name='view-order'),
    path('history/', views.order_history, name='order-history'),
    path('<int:order_id>/cancel/', views.cancel_order, name='cancel-order'),
    path('<int:order_id>/refund/', views.request_refund, name='request-refund'),
    path('<int:order_id>/invoice/', views.generate_invoice, name='generate-invoice'),

    
    path('admin/list/', views.admin_list_orders, name='admin-list-orders'),
    path('admin/<int:order_id>/status/', views.admin_update_order_status, name='admin-update-order-status'),
]
