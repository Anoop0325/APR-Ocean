from django.db.models import Q, Avg
from .models import Product, Category, Review

def get_all_categories():
    return Category.objects.all()

def filter_products(category_id=None, search_query=None, sort_by=None):
    queryset = Product.objects.all()
    
    if category_id:
        queryset = queryset.filter(category_id=category_id)
    
    if search_query:
        queryset = queryset.filter(
            Q(name__icontains=search_query) | 
            Q(brand__icontains=search_query) | 
            Q(description__icontains=search_query)
        )
    
    if sort_by == 'price_low':
        queryset = queryset.order_by('final_price')
    elif sort_by == 'price_high':
        queryset = queryset.order_by('-final_price')
        
    return queryset

def get_product_rating_stats():
    stats = Product.objects.annotate(
        avg_rating=Avg('reviews__rating')
    ).values('id', 'name', 'avg_rating')
    return stats
