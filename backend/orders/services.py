from django.db import transaction
from .models import Cart, CartItem, Order, OrderItem
from store.models import Product
from core.models import Address
import razorpay
from django.conf import settings

# RAZORPAY_KEY_ID = "rzp_test_..."
# RAZORPAY_KEY_SECRET = "..."

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
def place_order(user, address_id, payment_method='COD'):
    cart = get_or_create_cart(user)
    items = cart.items.all()
    
    if not items:
        raise ValueError("Cart is empty")
    
    address = Address.objects.get(id=address_id, user=user)
    total_amount = sum(item.product.final_price * item.quantity for item in items)
    
    order = Order.objects.create(
        user=user,
        address=address,
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
    
    # Razorpay Integration Logic
    if payment_method == 'ONLINE':
        try:
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            data = {
                "amount": int(total_amount * 100), # Amount in paise
                "currency": "INR",
                "receipt": f"order_rcpt_{order.id}"
            }
            razorpay_order = client.order.create(data=data)
            order.razorpay_order_id = razorpay_order['id']
            order.save()
        except Exception as e:
            print(f"Razorpay error: {e}")
            # In real production, handle this fallback or error
    
    items.delete()
    return order

def verify_payment(order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature):
    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
    params_dict = {
        'razorpay_order_id': razorpay_order_id,
        'razorpay_payment_id': razorpay_payment_id,
        'razorpay_signature': razorpay_signature
    }
    try:
        client.utility.verify_payment_signature(params_dict)
        order = Order.objects.get(id=order_id)
        order.payment_status = 'PAID'
        order.razorpay_payment_id = razorpay_payment_id
        order.save()
        return True
    except:
        return False
