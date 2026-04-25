from django.db import transaction
from .models import Cart, CartItem, Order, OrderItem
from store.models import Product

def get_or_create_cart(user):
    cart, created = Cart.objects.get_or_create(user=user)
    return cart

def add_to_cart(user, product_id, quantity=1):
    cart = get_or_create_cart(user)
    product = Product.objects.get(id=product_id)
    cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
    if not created:
        cart_item.quantity += quantity
    else:
        cart_item.quantity = quantity
    cart_item.save()
    return cart_item

def update_cart_item(user, item_id, quantity):
    cart = get_or_create_cart(user)
    cart_item = CartItem.objects.get(id=item_id, cart=cart)
    if quantity <= 0:
        cart_item.delete()
        return None
    cart_item.quantity = quantity
    cart_item.save()
    return cart_item

@transaction.atomic
def place_order(user, payment_method):
    cart = get_or_create_cart(user)
    items = cart.items.all()
    
    if not items:
        raise ValueError("Cart is empty")
    
    total_amount = sum(item.product.final_price * item.quantity for item in items)
    
    order = Order.objects.create(
        user=user,
        total_amount=total_amount,
        payment_method=payment_method,
        status='PENDING',
        payment_status='PENDING'
    )
    
    for item in items:
        if item.product.stock < item.quantity:
            raise ValueError(f"Not enough stock for {item.product.name}")
        
        OrderItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price_at_purchase=item.product.final_price
        )
        item.product.stock -= item.quantity
        item.product.save()
    
    items.delete()
    return order
