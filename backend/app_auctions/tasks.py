# pylint: disable=unused-import
# pylint: disable=missing-docstring
# pylint: disable=unused-argument
# pylint: disable=trailing-whitespace
from django.utils import timezone
from django.db.models import Count

from .models import AuctionItem, AuctionBid
from .views import AuctionStatus

def auction_task():
    try:
        # Query database records      
        auction_items = AuctionItem.objects.annotate(bid_count=Count('auctionbid')).filter(status__lt=AuctionStatus.SOLD).all()
        now = timezone.now()
        for item in auction_items:
            ended = item.ended_at
            if now >= ended:
                count = item.bid_count
                if count == 0:
                    item.status = AuctionStatus.EXPIRED
                elif item.highest_price >= item.reserve_price:
                    item.status = AuctionStatus.SOLD
                else:
                    item.status = AuctionStatus.RESERVE_NOT_MET
                
                print(f'id, status = {item.id}, {item.status}')
                item.save()

    except Exception as e:
        # Handle any exceptions gracefully
        print("An error occurred:", e)