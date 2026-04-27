import os
import django
import sys

# Set up Django environment
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from orders.models import Order
from django.utils import timezone

def fix_delivered_dates():
    orders = Order.objects.filter(status='DELIVERED', delivered_at__isnull=True)
    count = orders.count()
    print(f"Found {count} delivered orders without a timestamp.")
    
    for order in orders:
        # Use created_at as a fallback for old orders, or just use now()
        order.delivered_at = order.created_at 
        order.save()
        print(f"Fixed Order #{order.id}")
    
    print("Done!")

if __name__ == "__main__":
    fix_delivered_dates()
