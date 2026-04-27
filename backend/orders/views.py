from rest_framework import views, status, permissions, generics
from rest_framework.response import Response
from django.http import HttpResponse
from .serializers import CartSerializer, OrderSerializer, CartItemSerializer, OrderAdminSerializer
from .services import get_or_create_cart, add_to_cart, update_cart_item, place_order, verify_payment
from .models import Order
from core.models import User, Address
from core.permissions import IsAdminUser
from .invoice_service import generate_invoice_pdf
import io

class DownloadInvoiceView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            order = Order.objects.get(pk=pk, user=request.user)
            pdf_buffer = generate_invoice_pdf(order)
            return HttpResponse(
                pdf_buffer, 
                content_type='application/pdf',
                headers={'Content-Disposition': f'attachment; filename="invoice_{order.id}.pdf"'},
            )
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

class CartView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart = get_or_create_cart(request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def post(self, request):
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        item = add_to_cart(request.user, product_id, quantity)
        return Response(CartItemSerializer(item).data, status=status.HTTP_201_CREATED)

class CartItemUpdateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        quantity = int(request.data.get('quantity'))
        item = update_cart_item(request.user, pk, quantity)
        if item:
            return Response(CartItemSerializer(item).data)
        return Response({'message': 'Item removed'}, status=status.HTTP_204_NO_CONTENT)

    def delete(self, request, pk):
        update_cart_item(request.user, pk, 0)
        return Response(status=status.HTTP_204_NO_CONTENT)

class CheckoutView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        payment_method = request.data.get('payment_method', 'COD')
        address_id = request.data.get('address_id')
        if not address_id:
            return Response({'error': 'Address is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            order = place_order(request.user, address_id, payment_method)
            return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
        except (ValueError, Address.DoesNotExist) as e:
            return Response({'error': str(e) if isinstance(e, ValueError) else 'Invalid address selected'}, status=status.HTTP_400_BAD_REQUEST)

class VerifyPaymentView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_signature = request.data.get('razorpay_signature')
        
        success = verify_payment(order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature)
        if success:
            return Response({'message': 'Payment verified successfully'})
        return Response({'error': 'Payment verification failed'}, status=status.HTTP_400_BAD_REQUEST)

class OrderHistoryView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

class AdminOrderDashboardView(views.APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        orders = Order.objects.select_related('user', 'address').prefetch_related('items__product').order_by('-created_at')
        
        summary = {
            'total_orders': orders.count(),
            'pending_orders': orders.filter(status='PENDING').count(),
            'shipped_orders': orders.filter(status='SHIPPED').count(),
            'total_revenue': sum(o.total_amount for o in orders if o.payment_status == 'PAID' or o.payment_method == 'COD'),
            'orders': OrderAdminSerializer(orders, many=True).data
        }
        return Response(summary)

class AdminOrderUpdateView(views.APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
            status_value = request.data.get('status')
            if status_value in dict(Order.STATUS_CHOICES):
                order.status = status_value
                order.save()
                return Response(OrderAdminSerializer(order).data)
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
