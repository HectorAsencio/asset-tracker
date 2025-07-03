from rest_framework import serializers
from .models import FixedDeposit

class FixedDepositSerializer(serializers.ModelSerializer):
    class Meta:
        model = FixedDeposit
        fields = '__all__'
        read_only_fields = ['created_at']  # Assuming you want to prevent modification of created_at field