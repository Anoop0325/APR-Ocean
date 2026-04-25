from django.urls import path
from .views import (
    CartView, CartItemUpdateView, CheckoutView, 
    OrderHistoryView, OrderDetailView, DownloadInvoiceView
)

urlpatterns = [
    path('cart/', CartView.as_view(), name='cart'),
    path('cart/items/<int:pk>/', CartItemUpdateView.as_view(), name='cart-item-update'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('orders/', OrderHistoryView.as_view(), name='order-history'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('orders/<int:pk>/invoice/', DownloadInvoiceView.as_view(), name='order-invoice'),
]
