# Generated by Django 5.1.7 on 2025-03-20 14:18

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("api", "0002_delete_note"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Transaction",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("amount", models.DecimalField(decimal_places=2, max_digits=10)),
                ("timestamp", models.DateTimeField(auto_now_add=True)),
                (
                    "category",
                    models.CharField(
                        choices=[
                            ("business services", "Business Services"),
                            ("shopping", "Shopping"),
                            ("entertainment", "Entertainment"),
                            ("groceries", "Groceries"),
                            ("eating out", "Eating Out"),
                            ("bills", "Bills"),
                            ("transport", "Transport"),
                            ("health", "Health"),
                            ("travel", "Travel"),
                            ("finance", "Finance"),
                            ("general", "General"),
                        ],
                        max_length=50,
                    ),
                ),
                (
                    "particulars",
                    models.TextField(
                        help_text="Description of the transaction, either the sender or collector"
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
