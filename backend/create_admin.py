import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import User

# Configuration - Change these or set them as environment variables
PHONE = os.environ.get('ADMIN_PHONE', '9999999999')
PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin123')
NAME = 'Super Admin'

def create_admin():
    if not User.objects.filter(phone_number=PHONE).exists():
        print(f"Creating superuser for {PHONE}...")
        User.objects.create_superuser(phone_number=PHONE, password=PASSWORD, name=NAME)
        print("Superuser created successfully!")
    else:
        print(f"User {PHONE} already exists.")

if __name__ == '__main__':
    create_admin()
