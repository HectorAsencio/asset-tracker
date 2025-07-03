from django.contrib import admin
from .models import FixedDeposit

class FixedDepositAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'deposit_amount', 'bank_name', 'interest_rate', 
        'maturity_date', 'deposit_type', 'status', 'is_matured'
    )
    list_filter = ('bank_name', 'deposit_type', 'created_at')
    search_fields = ('bank_name', 'account_number', 'description')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at', 'days_to_maturity', 'status', 'is_matured')

admin.site.register(FixedDeposit, FixedDepositAdmin)
