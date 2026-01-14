from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import ClothingProduct, Review
from .serializers import ClothingProductSerializer, ReviewSerializer
from django.contrib.contenttypes.models import ContentType
from orders.models import OrderItem

class ProductListView(generics.ListAPIView):
    queryset = ClothingProduct.objects.all()
    serializer_class = ClothingProductSerializer

class ProductDetailView(generics.RetrieveAPIView):
    queryset = ClothingProduct.objects.all()
    serializer_class = ClothingProductSerializer
    lookup_field = 'id'

class ProductByCategoryView(generics.ListAPIView):
    serializer_class = ClothingProductSerializer

    def get_queryset(self):
        category = self.kwargs['category']
        return ClothingProduct.objects.filter(category=category)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_review(request, product_id):
    try:
        product = ClothingProduct.objects.get(id=product_id)
    except ClothingProduct.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)

    # Check if user already reviewed this product
    existing = Review.objects.filter(user=request.user, product_type='clothing', product_id=product.id).first()
    if existing:
        return Response({'error': 'You have already reviewed this product'}, status=400)

    # Check if user has purchased this product (OrderItem with matching content type and object id)
    clothing_ct = ContentType.objects.get_for_model(ClothingProduct)
    purchased = OrderItem.objects.filter(order__user=request.user, content_type=clothing_ct, object_id=product.id).exists()
    if not purchased:
        return Response({'error': 'You cannot write reviews as you have not bought this product'}, status=403)

    serializer = ReviewSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user, product_type='clothing', product_id=product.id)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def product_reviews(request, product_id):
    try:
        product = ClothingProduct.objects.get(id=product_id)
    except ClothingProduct.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)

    reviews = Review.objects.filter(product_type='clothing', product_id=product_id)
    serializer = ReviewSerializer(reviews, many=True, context={'request': request})
    return Response(serializer.data)
