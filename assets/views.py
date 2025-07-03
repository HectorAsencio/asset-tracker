from django.shortcuts import render
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Sum, Count
from .serializers import FixedDepositSerializer
from .models import FixedDeposit

# Create your views here.
class FixedDepositViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Fixed Deposit instances.
    Provides CRUD operations and additional statistical endpoints.
    """
    queryset = FixedDeposit.objects.all()
    serializer_class = FixedDepositSerializer
    
    def get_queryset(self):
        """Override to add filtering and search capabilities"""
        queryset = FixedDeposit.objects.all()
        
        # Filter by deposit type
        deposit_type = self.request.query_params.get('deposit_type', None)
        if deposit_type:
            queryset = queryset.filter(deposit_type=deposit_type)
        
        # Filter by bank
        bank_name = self.request.query_params.get('bank_name', None)
        if bank_name:
            queryset = queryset.filter(bank_name__icontains=bank_name)
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter == 'active':
            queryset = queryset.filter(maturity_date__gt=timezone.now().date())
        elif status_filter == 'matured':
            queryset = queryset.filter(maturity_date__lte=timezone.now().date())
            
        # Search functionality
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(bank_name__icontains=search) |
                Q(description__icontains=search) |
                Q(account_number__icontains=search)
            )
        
        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        """Custom logic when creating a new deposit"""
        # You can add additional logic here before saving
        # For example, logging, notifications, etc.
        serializer.save()
        
    def perform_update(self, serializer):
        """Custom logic when updating a deposit"""
        # You can add additional logic here before saving
        serializer.save()
    
    def perform_destroy(self, instance):
        """Custom logic when deleting a deposit"""
        # You can add additional logic here before deleting
        # For example, soft delete, logging, etc.
        instance.delete()
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get portfolio statistics"""
        queryset = self.get_queryset()
        
        total_deposits = queryset.count()
        total_amount = queryset.aggregate(Sum('deposit_amount'))['deposit_amount__sum'] or 0
        
        # Count by status
        active_count = sum(1 for deposit in queryset if deposit.status == 'active')
        maturing_soon_count = sum(1 for deposit in queryset if deposit.status == 'maturing_soon')
        matured_count = sum(1 for deposit in queryset if deposit.status == 'matured')
        
        # Count by deposit type
        type_breakdown = queryset.values('deposit_type').annotate(
            count=Count('id'),
            total=Sum('deposit_amount')
        )
        
        statistics = {
            'total_deposits': total_deposits,
            'total_amount': float(total_amount),
            'status_breakdown': {
                'active': active_count,
                'maturing_soon': maturing_soon_count,
                'matured': matured_count
            },
            'type_breakdown': list(type_breakdown)
        }
        
        return Response(statistics)
    
    @action(detail=False, methods=['get'])
    def maturing_soon(self, request):
        """Get deposits that are maturing within 30 days"""
        deposits = [deposit for deposit in self.get_queryset() if deposit.status == 'maturing_soon']
        serializer = self.get_serializer(deposits, many=True)
        return Response(serializer.data)
