from django.db import models

# Create your models here.
class FixedDeposit(models.Model):
    DEPOSIT_TYPE_CHOICES = [
        ('fixed', 'Fixed Deposit'),
        ('savings', 'Savings Account'),
        ('recurring', 'Recurring Deposit'),
        ('certificate', 'Certificate of Deposit'),
    ]
    
    # Required fields
    deposit_amount = models.DecimalField(max_digits=12, decimal_places=2, help_text="Amount deposited")
    maturity_date = models.DateField(help_text="Date when the deposit matures")
    bank_name = models.CharField(max_length=100, help_text="Name of the bank")
    
    # Optional fields
    interest_rate = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        null=True, 
        blank=True,
        help_text="Annual interest rate percentage"
    )
    account_number = models.CharField(
        max_length=50, 
        blank=True, 
        null=True,
        help_text="Bank account number"
    )
    deposit_type = models.CharField(
        max_length=20,
        choices=DEPOSIT_TYPE_CHOICES,
        default='fixed',
        help_text="Type of deposit"
    )
    description = models.TextField(
        blank=True, 
        null=True,
        help_text="Additional notes about the deposit"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Fixed Deposit"
        verbose_name_plural = "Fixed Deposits"

    def __str__(self):
        return f"{self.get_deposit_type_display()} - {self.bank_name}: ${self.deposit_amount}"
    
    @property
    def days_to_maturity(self):
        """Calculate days remaining until maturity"""
        from datetime import date
        today = date.today()
        return (self.maturity_date - today).days
    
    @property
    def is_matured(self):
        """Check if the deposit has matured"""
        return self.days_to_maturity < 0
    
    @property
    def status(self):
        """Get the current status of the deposit"""
        days = self.days_to_maturity
        if days < 0:
            return 'matured'
        elif days <= 30:
            return 'maturing_soon'
        else:
            return 'active'
