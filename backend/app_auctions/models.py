# pylint: disable=missing-docstring
from django.db import models
from app_auth.models import Account

# Create your models here.
class AuctionStatus:
    NEW = 0
    LIVE = 1
    LIVE_RESERVE_MET = 2
    SOLD = 3
    EXPIRED = 4
    RESERVE_NOT_MET = 5

class AuctionItem(models.Model):
    seller = models.ForeignKey(Account, on_delete=models.CASCADE)
    description = models.TextField(max_length=255)
    starting_price = models.FloatField()
    reserve_price = models.FloatField()
    highest_price = models.FloatField()
    # winner = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='winner')
    images = models.TextField()
    categories = models.TextField()
    started_at = models.DateTimeField()
    ended_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.IntegerField(default = 0)

    class Meta:
        ordering = ('-created_at',)

class AuctionBid(models.Model):
    item = models.ForeignKey(AuctionItem, on_delete=models.CASCADE)
    buyer = models.ForeignKey(Account, on_delete=models.CASCADE)
    price = models.FloatField()
    is_highest = models.BooleanField(default = True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-price',)
