from django.core.management.base import BaseCommand
from core.models import User
from store.models import Category, Product, Review
from django.db import transaction

class Command(BaseCommand):
    help = 'Seed data for pharmacy e-commerce'

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write('Seeding data...')

        admin_user, _ = User.objects.get_or_create(
            phone_number='9999999999',
            defaults={'name': 'Super Admin', 'role': 'SUPER_ADMIN', 'is_staff': True, 'is_superuser': True}
        )
        if _: admin_user.set_password('1234'); admin_user.save()

        staff_user, _ = User.objects.get_or_create(
            phone_number='8888888888',
            defaults={'name': 'Admin Staff', 'role': 'ADMIN', 'is_staff': True}
        )
        if _: staff_user.set_password('1234'); staff_user.save()

        normal_user, _ = User.objects.get_or_create(
            phone_number='7777777777',
            defaults={'name': 'Test User', 'role': 'USER'}
        )
        if _: normal_user.set_password('1234'); normal_user.save()

        cats = ['Tablets', 'Syrups', 'Personal Care', 'Medical Devices', 'OTC']
        cat_objs = {}
        for name in cats:
            cat, _ = Category.objects.get_or_create(name=name)
            cat_objs[name] = cat

        products_data = [
            {'name': 'Paracetamol 500mg', 'category': 'Tablets', 'brand': 'Generic', 'mrp': 50, 'discount': 10, 'gst': 12, 'stock': 100},
            {'name': 'Amoxicillin 250mg', 'category': 'Tablets', 'brand': 'Cipla', 'mrp': 150, 'discount': 5, 'gst': 12, 'stock': 50},
            {'name': 'Cough Syrup 100ml', 'category': 'Syrups', 'brand': 'Dabur', 'mrp': 80, 'discount': 0, 'gst': 5, 'stock': 30},
            {'name': 'Digital Thermometer', 'category': 'Medical Devices', 'brand': 'Omron', 'mrp': 250, 'discount': 15, 'gst': 18, 'stock': 20},
            {'name': 'Face Mask (Pack of 10)', 'category': 'OTC', 'brand': 'Safety', 'mrp': 100, 'discount': 50, 'gst': 5, 'stock': 200},
            {'name': 'Vitamin C Supplement', 'category': 'OTC', 'brand': 'Nature', 'mrp': 300, 'discount': 20, 'gst': 18, 'stock': 5},
            {'name': 'Band-Aid', 'category': 'OTC', 'brand': 'Johnson', 'mrp': 20, 'discount': 0, 'gst': 12, 'stock': 0},
        ]

        for p_data in products_data:
            Product.objects.get_or_create(
                name=p_data['name'],
                defaults={
                    'category': cat_objs[p_data['category']],
                    'brand': p_data['brand'],
                    'description': f"High quality {p_data['name']} for your needs.",
                    'mrp': p_data['mrp'],
                    'discount_percent': p_data['discount'],
                    'gst_percent': p_data['gst'],
                    'stock': p_data['stock']
                }
            )

        p1 = Product.objects.first()
        if p1:
            Review.objects.get_or_create(
                user=normal_user,
                product=p1,
                defaults={'rating': 5, 'comment': 'Excellent product, very effective!'}
            )
            Review.objects.get_or_create(
                user=staff_user,
                product=p1,
                defaults={'rating': 4, 'comment': 'Good value for money.'}
            )

        self.stdout.write(self.style.SUCCESS('Successfully seeded dummy data.'))
