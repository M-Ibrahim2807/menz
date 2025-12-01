# payments/urls.py
from django.urls import path
from .views import CreatePaymentView, PaymentDetailView

urlpatterns = [
    path('create/', CreatePaymentView.as_view(), name='payment-create'),
    path('<int:id>/', PaymentDetailView.as_view(), name='payment-detail'),
]
