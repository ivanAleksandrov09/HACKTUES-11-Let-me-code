from django.db import models
from django.contrib.auth.models import User

class Transaction(models.Model):
    CATEGORY_CHOICES = [
        ('business services', 'Business Services'),
        ('shopping', 'Shopping'),
        ('entertainment', 'Entertainment'),
        ('groceries', 'Groceries'),
        ('eating out', 'Eating Out'),
        ('bills', 'Bills'),
        ('transport', 'Transport'),
        ('health', 'Health'),
        ('travel', 'Travel'),
        ('finance', 'Finance'),
        ('general', 'General'),
    ]

    CURRENCY_CHOICES = [
        ('USD', 'USD'),
        ('EUR', 'EUR'),
        ('BGN', 'BGN')
    ]

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    time = models.DateTimeField(auto_now_add=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='BGN')
    description = models.TextField(blank=True, null=True)


    def __str__(self):
        return f"Income: {self.amount} {self.currency}"


class Income(models.Model):
    CURRENCY_CHOICES = [
        ('USD', 'USD'),
        ('EUR', 'EUR'),
        ('BGN', 'BGN')
    ]
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='BGN')
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Income: {self.amount} {self.currency}"

class TotalBudget(models.Model):
    amount = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    currency = models.CharField(max_length=3, default='BGN')
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Total Budget: {self.amount} {self.currency}"
