from rest_framework import views, response
from django.db.models import Avg, Count
from .models import Product, Review
from core.permissions import IsAdminUser

class InventoryStatusView(views.APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        low_stock_threshold = 10
        products = Product.objects.all().values('id', 'name', 'stock', 'brand')
        summary = {
            'total_products': products.count(),
            'low_stock_count': products.filter(stock__lte=low_stock_threshold).count(),
            'out_of_stock_count': products.filter(stock=0).count(),
            'products': list(products)
        }
        return response.Response(summary)

class RatingsDashboardView(views.APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        avg_rating = Review.objects.aggregate(avg=Avg('rating'))['avg'] or 0
        product_ratings = Product.objects.annotate(
            avg_rating=Avg('reviews__rating'),
            review_count=Count('reviews')
        ).values('id', 'name', 'avg_rating', 'review_count')
        
        recent_reviews = Review.objects.select_related('user', 'product').order_by('-created_at')[:10]
        recent_reviews_data = [
            {
                'id': r.id,
                'user': r.user.phone_number,
                'product': r.product.name,
                'rating': r.rating,
                'comment': r.comment,
                'date': r.created_at
            } for r in recent_reviews
        ]

        summary = {
            'overall_avg_rating': round(avg_rating, 2),
            'product_ratings': list(product_ratings),
            'recent_reviews': recent_reviews_data
        }
        return response.Response(summary)
