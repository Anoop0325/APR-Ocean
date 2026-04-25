from rest_framework import views, status, permissions, generics
from rest_framework.response import Response
from django.http import HttpResponse
from .serializers import CartSerializer, OrderSerializer, CartItemSerializer
from .services import get_or_create_cart, add_to_cart, update_cart_item, place_order
from .models import Order
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
        try:
            order = place_order(request.user, payment_method)
            return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

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
