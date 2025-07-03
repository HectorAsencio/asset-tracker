from django.shortcuts import render
from rest_framework import viewsets
from .serializers import FixedDepositSerializer
from .models import FixedDeposit

# Create your views here.
class FixedDepositViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Fixed Deposit instances.
    """
    queryset = FixedDeposit.objects.all()
    serializer_class = FixedDepositSerializer

    def perform_create(self, serializer):
        # Custom logic before saving the instance can be added here
        serializer.save()  # Save the instance using the serializer