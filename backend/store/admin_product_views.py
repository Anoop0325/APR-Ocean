from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer
from core.permissions import IsAdminUser

class AdminProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]

    # ModelViewSet handles list, create, retrieve, update, partial_update, destroy
