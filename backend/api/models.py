from django.db import models
from django.contrib.auth.models import User
import datetime


def get_current_time():
    return datetime.datetime.now()


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    budget = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    currency = models.CharField(max_length=3, default="USD")

    def __str__(self):
        return f"{self.user.username}'s profile"


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
