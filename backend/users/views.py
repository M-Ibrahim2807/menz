from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import login
from .models import User
from .serializers import UserRegistrationSerializer,UserLoginSerializer,UserProfileSerializer
@api_view(['GET','POST'])
def register_user(request):
    if request.method=="POST":
        serializer=UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
           user=serializer.save()
           refresh = RefreshToken.for_user(user)
           return Response({
                'message': 'User registered successfully',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username
                },
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        return Response({
            'error': 'Registration failed',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
   
    elif request.method == 'GET':
        return Response({
            'message': 'User registration endpoint',
            'instructions': 'Send POST request with user data to register'
        })
    
@api_view(['GET','POST'])
def login_user(request):
    
   
    
    if request.method == 'POST':
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
        
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'user_type': user.user_type
                },
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_200_OK)
        
        return Response({
            'error': 'Login failed',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)    
    elif request.method == 'GET':
        return Response({
            'message': 'User login endpoint',
            'instructions': 'Send POST request with email and password to login'
        })
# Create your views here.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_user(request):
    
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    serializer = UserProfileSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Profile updated successfully',
            'user': serializer.data
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)