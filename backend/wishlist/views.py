from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.contenttypes.models import ContentType

from .models import Wishlist, WishlistItem
from product.models import ClothingProduct

def get_user_wishlist(user):
    wishlist, created = Wishlist.objects.get_or_create(user=user)
    return wishlist

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_wishlist(request):
    wishlist = get_user_wishlist(request.user)
    from .serializers import WishlistSerializer
    serializer = WishlistSerializer(wishlist, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_wishlist(request):
    product_id = request.data.get("product_id")

    try:
        product = ClothingProduct.objects.get(id=product_id)
    except ClothingProduct.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)

    wishlist = get_user_wishlist(request.user)
    content_type = ContentType.objects.get_for_model(ClothingProduct)

    # prevent duplicates
    item, created = WishlistItem.objects.get_or_create(
        wishlist=wishlist, content_type=content_type, object_id=product.id
    )

    if not created:
        return Response({"message": "Product already in wishlist"}, status=200)

    return Response({"message": "Added to wishlist"}, status=201)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_wishlist(request, item_id):
    try:
        item = WishlistItem.objects.get(id=item_id, wishlist__user=request.user)
    except WishlistItem.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)

    item.delete()
    return Response({"message": "Removed from wishlist"}, status=200)
