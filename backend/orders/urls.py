from django.urls import path
from .views import (
    CartView, CartItemUpdateView, CheckoutView, VerifyPaymentView,
    OrderHistoryView, OrderDetailView, DownloadInvoiceView,
    AdminOrderDashboardView, AdminOrderUpdateView
)

urlpatterns = [
    path('cart/', CartView.as_view(), name='cart'),
    path('cart/items/<int:pk>/', CartItemUpdateView.as_view(), name='cart-item-update'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('verify-payment/', VerifyPaymentView.as_view(), name='verify-payment'),
    path('orders/', OrderHistoryView.as_view(), name='order-history'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('orders/<int:pk>/invoice/', DownloadInvoiceView.as_view(), name='order-invoice'),
    path('admin/dashboard/', AdminOrderDashboardView.as_view(), name='admin-order-dashboard'),
    path('admin/orders/<int:pk>/', AdminOrderUpdateView.as_view(), name='admin-order-update'),
]
