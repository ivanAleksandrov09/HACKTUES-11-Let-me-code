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

    def __str__(self):
        return (
            f"{self.user.username} - {self.amount} - {self.category} - {self.timestamp}"
        )
