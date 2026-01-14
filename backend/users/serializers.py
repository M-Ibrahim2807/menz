from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True, min_length=6)
    phone = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    # Override username to skip validation
    username = serializers.CharField(max_length=150, required=True, validators=[])
    
    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password_confirm', 'phone', 'address']
    
    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError("Password must be at least 6 characters.")
        return value
    
    def validate(self, data):
        if data.get('password') != data.get('password_confirm'):
            raise serializers.ValidationError({"password": "Passwords do not match"})
        return data
        
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=password,
            phone=validated_data.get('phone', ''),
            address=validated_data.get('address', '')
        )
        
        return user


class UserLoginSerializer(serializers.Serializer):
    # Change to allow either username or email
    username_or_email = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username_or_email = data.get('username_or_email')
        password = data.get('password')

        if username_or_email and password:
            # Try to authenticate with username
            user = authenticate(username=username_or_email, password=password)
            
            # If that fails, try with email
            if user is None:
                try:
                    user_obj = User.objects.get(email=username_or_email)
                    user = authenticate(username=user_obj.username, password=password)
                except User.DoesNotExist:
                    user = None

            if user:
                if user.is_active:
                    data['user'] = user
                else:
                    raise serializers.ValidationError('User account is disabled.')
            else:
                raise serializers.ValidationError('Wrong username/email or password.')
        else:
            raise serializers.ValidationError('Must enter username/email and password')    
        return data

    
class UserProfileSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'phone', 'address', 'user_type', 'date_joined']
        read_only_fields = ['id', 'date_joined', 'user_type']
