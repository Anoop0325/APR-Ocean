from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryListView, ProductListView, ProductDetailView, 
    ReviewCreateView, ProductReviewListView
)
from .admin_views import InventoryStatusView, RatingsDashboardView
from .admin_product_views import AdminProductViewSet

router = DefaultRouter()
router.register(r'admin/products', AdminProductViewSet, basename='admin-products')

urlpatterns = [
    path('', include(router.urls)),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('products/<int:pk>/reviews/', ProductReviewListView.as_view(), name='product-reviews'),
    path('reviews/', ReviewCreateView.as_view(), name='review-create'),
    path('admin/inventory/', InventoryStatusView.as_view(), name='admin-inventory'),
    path('admin/ratings/', RatingsDashboardView.as_view(), name='admin-ratings'),
]
