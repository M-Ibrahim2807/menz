from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from product.models import Product

def _get_or_create_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart = _get_or_create_cart(request.user)
    serializer = CartSerializer(cart, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    """
    Expected body:
    {
      "product_id": <product_id>,
      "quantity": <qty> (optional, default 1)
    }
    """
    user = request.user
    product_id = request.data.get('product_id')
    qty = int(request.data.get('quantity', 1))
    if not product_id:
        return Response({'error': 'product_id required'}, status=status.HTTP_400_BAD_REQUEST)

    product = get_object_or_404(Product, id=product_id)

    if product.stock < qty:
        return Response({'error': 'Not enough stock'}, status=status.HTTP_400_BAD_REQUEST)

    cart = _get_or_create_cart(user)
    cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
    if not created:
        cart_item.quantity += qty
    else:
        cart_item.quantity = qty
    cart_item.save()
    serializer = CartItemSerializer(cart_item, context={'request': request})
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_cart_item(request, item_id):
    """
    Body:
    {
      "quantity": <new_qty>
    }
    """
    cart_item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
    qty = request.data.get('quantity')
    if qty is None:
        return Response({'error': 'quantity required'}, status=status.HTTP_400_BAD_REQUEST)
    qty = int(qty)
    if qty <= 0:
        cart_item.delete()
        return Response({'message': 'Item removed because quantity set to 0'}, status=status.HTTP_200_OK)

    if cart_item.product.stock < qty:
        return Response({'error': 'Not enough stock'}, status=status.HTTP_400_BAD_REQUEST)

    cart_item.quantity = qty
    cart_item.save()
    serializer = CartItemSerializer(cart_item, context={'request': request})
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_cart_item(request, item_id):
    cart_item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
    cart_item.delete()
    return Response({'message': 'Item removed'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_cart(request):
    cart = _get_or_create_cart(request.user)
    cart.items.all().delete()
    return Response({'message': 'Cart cleared'}, status=status.HTTP_200_OK)
