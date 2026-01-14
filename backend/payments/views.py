# payments/views.py
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from .models import Payment
from .serializers import PaymentSerializer
from orders.models import Order

class CreatePaymentView(generics.CreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # auto-set user to current user
        serializer.save(user=self.request.user)

class PaymentDetailView(generics.RetrieveAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"


@api_view(['POST'])
@permission_classes([IsAdminUser])
def approve_payment(request, payment_id):
    """
    POST /api/payments/<payment_id>/approve/
    Admin approves a payment and updates the associated order status to 'paid'
    """
    try:
        payment = Payment.objects.get(id=payment_id)
        payment.status = 'approved'
        payment.save()

        # Update associated order: set track status to 'shipping' and mirror status
        order = payment.order
        order.track_order_status = 'shipping'
        order.status = 'shipping'
        order.save(update_fields=['track_order_status', 'status'])

        serializer = PaymentSerializer(payment)
        return Response(
            {'message': 'Payment approved', 'payment': serializer.data},
            status=status.HTTP_200_OK
        )
    except Payment.DoesNotExist:
        return Response(
            {'error': 'Payment not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': 'Failed to approve payment', 'detail': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAdminUser])
def reject_payment(request, payment_id):
    """
    POST /api/payments/<payment_id>/reject/
    Admin rejects a payment and updates the associated order status to 'cancelled'
    """
    try:
        payment = Payment.objects.get(id=payment_id)
        payment.status = 'rejected'
        payment.save()

        # Update associated order: set track status to '-' and mirror rejected status
        order = payment.order
        order.track_order_status = '-'
        order.status = 'rejected'
        order.save(update_fields=['track_order_status', 'status'])

        serializer = PaymentSerializer(payment)
        return Response(
            {'message': 'Payment rejected', 'payment': serializer.data},
            status=status.HTTP_200_OK
        )
    except Payment.DoesNotExist:
        return Response(
            {'error': 'Payment not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': 'Failed to reject payment', 'detail': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
