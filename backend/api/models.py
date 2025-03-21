from django.db import models
from django.contrib.auth.models import User
import datetime


def get_current_time():
    return datetime.datetime.now()


class Transaction(models.Model):
    class Category(models.TextChoices):
        BUSINESS_SERVICES = "business services"
        SHOPPING = "shopping"
        ENTERTAINMENT = "entertainment"
        GROCERIES = "groceries"
        EATING_OUT = "eating out"
        BILLS = "bills"
        TRANSPORT = "transport"
        HEALTH = "health"
        TRAVEL = "travel"
        FINANCE = "finance"
        GENERAL = "general"

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(default=get_current_time)
    category = models.CharField(choices=Category, max_length=50)
    particulars = models.TextField(
        help_text="Description of the transaction, either the sender or collector"
    )
    currency = models.CharField(
        max_length=3, default="USD", help_text="Currency of the transaction"
    )

    def __str__(self):
        return (
            f"{self.user.username} - {self.amount} - {self.category} - {self.timestamp}"
        )


class Stock(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    ticker = models.CharField(max_length=10)
    quantity = models.IntegerField()
    price_per_share = models.DecimalField(max_digits=10, decimal_places=2)
    purchase_date = models.DateTimeField(default=get_current_time)

    def __str__(self):
        return f"{self.user.username} - {self.ticker} - {self.quantity} shares at {self.price_per_share} each"


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
