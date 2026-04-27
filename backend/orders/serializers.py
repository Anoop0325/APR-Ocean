from rest_framework import serializers
from .models import Cart, CartItem, Order, OrderItem
from store.serializers import ProductSerializer
from core.serializers import AddressSerializer

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_price']

    def get_total_price(self, obj):
        return sum(item.product.final_price * item.quantity for item in obj.items.all())

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price_at_purchase']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    address_details = AddressSerializer(source='address', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'total_amount', 'status', 'payment_method', 'payment_status', 'created_at', 'items', 'address', 'address_details']


class OrderAdminSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.ReadOnlyField(source='user.email')
    user_phone = serializers.ReadOnlyField(source='user.phone_number')
    user_full_name = serializers.ReadOnlyField(source='user.name')
    address_details = AddressSerializer(source='address', read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
