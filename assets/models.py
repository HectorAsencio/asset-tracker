from django.db import models

# Create your models here.
class FixedDeposit(models.Model):
    deposit_amount = models.DecimalField(max_digits=10, decimal_places=2)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2)
    maturity_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Fixed Deposit of {self.deposit_amount} at {self.interest_rate}% interest"