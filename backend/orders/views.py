from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db import transaction

from .models import Order, OrderItem, RefundRequest
from .serializers import OrderSerializer, CreateOrderItemSerializer, RefundRequestSerializer
from product.models import Product
from cart.models import Cart, CartItem

# Simple loyalty calculation: 1 point per 10 currency units
def calculate_loyalty_points(amount):
    try:
        pts = int(float(amount) // 10)
    except Exception:
        pts = 0
    return pts

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def place_order(request):
    """
    Place an order.
    Option A: If the body includes "use_cart": true -> place order from user's cart
    Option B: Provide items list: [{"product_id": 1, "quantity": 2}, ...] and shipping_address
    """

    user = request.user
    use_cart = request.data.get('use_cart', True)
    shipping_address = request.data.get('shipping_address', '') or getattr(user, 'address', '')

    items_input = []
    if use_cart:
        # get user's cart items
        cart, _ = Cart.objects.get_or_create(user=user)
        cart_items = cart.items.select_related('product').all()
        if not cart_items.exists():
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)
        for ci in cart_items:
            items_input.append({'product_id': ci.product.id, 'quantity': ci.quantity})
    else:
        items_input = request.data.get('items', [])
        if not items_input:
            return Response({"error": "No items provided"}, status=status.HTTP_400_BAD_REQUEST)

    # validate items, check stock
    validated_items = []
    for it in items_input:
        serializer = CreateOrderItemSerializer(data=it)
        if not serializer.is_valid():
            return Response({'error': 'Invalid item data', 'details': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        product = get_object_or_404(Product, id=data['product_id'])
        if product.stock < data['quantity']:
            return Response({'error': f'Not enough stock for {product.name}'}, status=status.HTTP_400_BAD_REQUEST)
        validated_items.append((product, data['quantity']))

    # create order
    order = Order.objects.create(user=user, shipping_address=shipping_address, status='pending')
    total = 0
    # create order items & decrement stock
    for product, qty in validated_items:
        oi = OrderItem.objects.create(
            order=order,
            product=product,
            product_name=product.name,
            price_at_purchase=product.price,
            quantity=qty
        )
        subtotal = oi.calculate_subtotal()
        total += subtotal
        # decrement stock
        product.stock = product.stock - qty
        product.save(update_fields=['stock'])

    order.total_amount = total
    # loyalty points
    pts = calculate_loyalty_points(total)
    order.loyalty_points_earned = pts
    order.save(update_fields=['total_amount', 'loyalty_points_earned'])

    # if order was from cart -> clear cart
    if use_cart:
        cart.items.all().delete()

    serializer = OrderSerializer(order, context={'request': request})
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_order(request, order_id):
    order = get_object_or_404(Order, id=order_id, user=request.user)
    serializer = OrderSerializer(order, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_history(request):
    orders = Order.objects.filter(user=request.user).order_by('-order_date')
    serializer = OrderSerializer(orders, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_order(request, order_id):
    order = get_object_or_404(Order, id=order_id, user=request.user)
    if order.status in ['cancelled', 'refunded', 'delivered']:
        return Response({'error': f'Order cannot be cancelled in status {order.status}'}, status=status.HTTP_400_BAD_REQUEST)

    # revert stock
    for item in order.items.all():
        prod = item.product
        prod.stock = prod.stock + item.quantity
        prod.save(update_fields=['stock'])

    order.status = 'cancelled'
    order.save(update_fields=['status'])
    return Response({'message': 'Order cancelled'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_refund(request, order_id):
    order = get_object_or_404(Order, id=order_id, user=request.user)
    reason = request.data.get('reason', '')
    if not reason:
        return Response({'error': 'reason is required'}, status=status.HTTP_400_BAD_REQUEST)
    # create refund request
    refund = RefundRequest.objects.create(order=order, user=request.user, reason=reason, status='pending')
    serializer = RefundRequestSerializer(refund)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_invoice(request, order_id):
    """
    Generate invoice data and return JSON.
    Also marks loyalty points for the order (already stored on order).
    """
    order = get_object_or_404(Order, id=order_id, user=request.user)
    order.calculate_total()  # ensure total is accurate

    invoice = {
        'invoice_id': f'INV-{order.id}',
        'order_id': order.id,
        'date': order.order_date,
        'customer': {
            'id': request.user.id,
            'email': request.user.email,
        },
        'items': [{
            'product_name': item.product_name,
            'unit_price': float(item.price_at_purchase),
            'quantity': item.quantity,
            'subtotal': item.calculate_subtotal()
        } for item in order.items.all()],
        'total': float(order.total_amount),
        'loyalty_points_earned': order.loyalty_points_earned
    }

    # Optionally, persist loyalty points to a separate store or notify user.
    return Response(invoice)

# Admin endpoints
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_list_orders(request):
    orders = Order.objects.all().order_by('-order_date')
    serializer = OrderSerializer(orders, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_update_order_status(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    new_status = request.data.get('status')
    if new_status not in dict(Order.STATUS_CHOICES).keys():
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
    order.status = new_status
    order.save(update_fields=['status'])
    return Response({'message': 'Status updated', 'order_id': order.id, 'status': order.status})
