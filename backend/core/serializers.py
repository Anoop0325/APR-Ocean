from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'phone_number', 'email', 'name', 'role']
        read_only_fields = ['role']

class RegisterSerializer(serializers.ModelSerializer):
    pin = serializers.CharField(write_only=True, min_length=4, max_length=4)

    class Meta:
        model = User
        fields = ['phone_number', 'name', 'pin', 'email']

    def create(self, validated_data):
        pin = validated_data.pop('pin')
        user = User.objects.create_user(
            phone_number=validated_data['phone_number'],
            name=validated_data.get('name'),
            password=pin,
            email=validated_data.get('email')
        )
        return user

class LoginSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    pin = serializers.CharField(write_only=True)
