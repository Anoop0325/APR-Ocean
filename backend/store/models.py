from django.db import models
from core.models import User

class Category(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    brand = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField()
    
    mrp = models.DecimalField(max_digits=10, decimal_places=2)
    discount_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    gst_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    final_price = models.DecimalField(max_digits=10, decimal_places=2, editable=False)
    
    stock = models.IntegerField(default=0)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    
    def save(self, *args, **kwargs):
        discount_amount = float(self.mrp) * (float(self.discount_percent) / 100)
        price_after_discount = float(self.mrp) - discount_amount
        gst_amount = price_after_discount * (float(self.gst_percent) / 100)
        self.final_price = price_after_discount + gst_amount
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} - {self.rating} ({self.user.phone_number})"
