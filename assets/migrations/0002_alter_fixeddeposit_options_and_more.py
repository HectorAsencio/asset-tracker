# Generated by Django 5.2.4 on 2025-07-03 23:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assets', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='fixeddeposit',
            options={'ordering': ['-created_at'], 'verbose_name': 'Fixed Deposit', 'verbose_name_plural': 'Fixed Deposits'},
        ),
        migrations.AddField(
            model_name='fixeddeposit',
            name='account_number',
            field=models.CharField(blank=True, help_text='Bank account number', max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='fixeddeposit',
            name='bank_name',
            field=models.CharField(default='Banco BCI', help_text='Name of the bank', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='fixeddeposit',
            name='deposit_type',
            field=models.CharField(choices=[('fixed', 'Fixed Deposit'), ('savings', 'Savings Account'), ('recurring', 'Recurring Deposit'), ('certificate', 'Certificate of Deposit')], default='fixed', help_text='Type of deposit', max_length=20),
        ),
        migrations.AddField(
            model_name='fixeddeposit',
            name='description',
            field=models.TextField(blank=True, help_text='Additional notes about the deposit', null=True),
        ),
        migrations.AddField(
            model_name='fixeddeposit',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='fixeddeposit',
            name='deposit_amount',
            field=models.DecimalField(decimal_places=2, help_text='Amount deposited', max_digits=12),
        ),
        migrations.AlterField(
            model_name='fixeddeposit',
            name='interest_rate',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='Annual interest rate percentage', max_digits=5, null=True),
        ),
        migrations.AlterField(
            model_name='fixeddeposit',
            name='maturity_date',
            field=models.DateField(help_text='Date when the deposit matures'),
        ),
    ]
