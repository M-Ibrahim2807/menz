from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.contenttypes.models import ContentType
from django.db import transaction

from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from product.models import ClothingProduct


def _get_or_create_cart(user):
    """Helper to get or create user's cart."""
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    """
    GET /api/cart/
    Retrieve user's cart with all items and total.
    """
    try:
        cart = _get_or_create_cart(request.user)
        
        # Clean up invalid cart items (where product no longer exists)
        invalid_items = []
        for item in cart.items.all():
            if item.product is None:
                invalid_items.append(item.id)
        
        if invalid_items:
            CartItem.objects.filter(id__in=invalid_items).delete()
        
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response(
            {'error': 'Failed to retrieve cart', 'detail': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def add_to_cart(request):
    """
    POST /api/cart/add/
    Add product to cart or increase quantity if already in cart.
    
    Expected body:
    {
      "product_id": <int>,
      "quantity": <int> (optional, default 1)
    }
    """
    try:
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)

        # Validate input
        if not product_id:
            return Response(
                {'error': 'product_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            product_id = int(product_id)
            quantity = int(quantity)
            if quantity <= 0:
                return Response(
                    {'error': 'quantity must be greater than 0'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except (ValueError, TypeError) as e:
            return Response(
                {'error': f'Invalid input: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get product
        try:
            product = ClothingProduct.objects.get(id=product_id)
        except ClothingProduct.DoesNotExist:
            return Response(
                {'error': f'Product with id {product_id} not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check stock
        if product.stock < quantity:
            return Response(
                {'error': f'Not enough stock. Available: {product.stock}, Requested: {quantity}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get or create cart
        cart = _get_or_create_cart(request.user)
        content_type = ContentType.objects.get_for_model(ClothingProduct)

        # Add or update cart item using GenericForeignKey
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            content_type=content_type,
            object_id=product.id
        )

        if not created:
            # Item already in cart, add to quantity
            new_quantity = cart_item.quantity + quantity
            if product.stock < new_quantity:
                return Response(
                    {'error': f'Not enough stock for total quantity. Available: {product.stock}, Requested: {new_quantity}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            cart_item.quantity = new_quantity
        else:
            # New item, set quantity
            cart_item.quantity = quantity

        cart_item.save()

        serializer = CartItemSerializer(cart_item, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except CartItem.MultipleObjectsReturned:
        return Response(
            {'error': 'Duplicate cart items found. Please contact support.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response(
            {'error': 'Failed to add item to cart', 'detail': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def update_cart_item(request, item_id):
    """
    PUT/PATCH /api/cart/update/<item_id>/
    Update quantity of a cart item.
    
    Body:
    {
      "quantity": <int>
    }
    """
    try:
        # Get cart item (ensure it belongs to user)
        try:
            cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response(
                {'error': 'Cart item not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        quantity = request.data.get('quantity')
        if quantity is None:
            return Response(
                {'error': 'quantity is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            quantity = int(quantity)
        except (ValueError, TypeError):
            return Response(
                {'error': 'quantity must be a valid integer'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # If quantity is 0 or negative, remove item
        if quantity <= 0:
            cart_item.delete()
            return Response(
                {'message': 'Item removed from cart'},
                status=status.HTTP_200_OK
            )

        # Check stock
        product = cart_item.product
        if product is None:
            return Response(
                {'error': 'Product no longer exists'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if product.stock < quantity:
            return Response(
                {'error': f'Not enough stock. Available: {product.stock}, Requested: {quantity}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update quantity
        cart_item.quantity = quantity
        cart_item.save()

        serializer = CartItemSerializer(cart_item, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response(
            {'error': 'Failed to update cart item', 'detail': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def remove_cart_item(request, item_id):
    """
    DELETE /api/cart/remove/<item_id>/
    Remove a specific item from cart.
    """
    try:
        try:
            cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response(
                {'error': 'Cart item not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        cart_item.delete()
        return Response(
            {'message': 'Item removed from cart'},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response(
            {'error': 'Failed to remove item from cart', 'detail': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def clear_cart(request):
    """
    DELETE /api/cart/clear/
    Remove all items from user's cart.
    """
    try:
        cart = _get_or_create_cart(request.user)
        deleted_count, _ = cart.items.all().delete()
        return Response(
            {'message': f'Cart cleared. {deleted_count} items removed.'},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response(
            {'error': 'Failed to clear cart', 'detail': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
