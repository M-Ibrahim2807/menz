# payments/urls.py
from django.urls import path
from .views import CreatePaymentView, PaymentDetailView, approve_payment, reject_payment

urlpatterns = [
    path('create/', CreatePaymentView.as_view(), name='payment-create'),
    path('<int:id>/', PaymentDetailView.as_view(), name='payment-detail'),
    path('<int:payment_id>/approve/', approve_payment, name='payment-approve'),
    path('<int:payment_id>/reject/', reject_payment, name='payment-reject'),
]
