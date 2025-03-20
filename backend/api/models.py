from django.db import models
from django.contrib.auth.models import User

class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)
    category = models.CharField(max_length=50)
    particulars = models.TextField(help_text="Description of the transaction, either the sender or collector")
    
    def __str__(self):
        return f"{self.user.username} - {self.amount} - {self.category} - {self.timestamp}"