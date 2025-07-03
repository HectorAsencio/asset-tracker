from rest_framework import serializers
from .models import FixedDeposit
from datetime import date

class FixedDepositSerializer(serializers.ModelSerializer):
    # Add computed fields for frontend
    days_to_maturity = serializers.ReadOnlyField()
    is_matured = serializers.ReadOnlyField()
    status = serializers.ReadOnlyField()
    deposit_type_display = serializers.CharField(source='get_deposit_type_display', read_only=True)
    
    class Meta:
        model = FixedDeposit
        fields = [
            'id',
            'deposit_amount',
            'maturity_date', 
            'bank_name',
            'interest_rate',
            'account_number',
            'deposit_type',
            'deposit_type_display',
            'description',
            'created_at',
            'updated_at',
            'days_to_maturity',
            'is_matured',
            'status'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def validate_deposit_amount(self, value):
        """Validate that deposit amount is positive"""
        if value <= 0:
            raise serializers.ValidationError("Deposit amount must be greater than zero.")
        return value
    
    def validate_interest_rate(self, value):
        """Validate interest rate if provided"""
        if value is not None and (value < 0 or value > 100):
            raise serializers.ValidationError("Interest rate must be between 0 and 100 percent.")
        return value
    
    def validate_maturity_date(self, value):
        """Validate that maturity date is in the future"""
        if value <= date.today():
            raise serializers.ValidationError("Maturity date must be in the future.")
        return value
    
    def validate_bank_name(self, value):
        """Validate bank name"""
        if not value.strip():
            raise serializers.ValidationError("Bank name cannot be empty.")
        return value.strip().title()  # Clean and format the bank name
    
    def validate_account_number(self, value):
        """Validate account number if provided"""
        if value and len(value.strip()) < 5:
            raise serializers.ValidationError("Account number must be at least 5 characters long.")
        return value.strip() if value else value
