# pylint: disable=unused-import
# pylint: disable=missing-docstring
# pylint: disable=unused-argument
# pylint: disable=trailing-whitespace
from django.utils import timezone
from django.db.models import Count

from .models import AuctionItem, AuctionBid, AuctionStatus

def auction_task():
    try:
        # Query database records      
        auction_items = AuctionItem.objects.annotate(bid_count=Count('auctionbid')).filter(status__lt=AuctionStatus.SOLD).all()
        now = timezone.now()
        for item in auction_items:
            started = item.started_at
            ended = item.ended_at

            if now >= ended:
                count = item.bid_count
                # not yet completed
                if item.status < AuctionStatus.SOLD:
                    if count == 0:
                        item.status = AuctionStatus.EXPIRED
                    elif item.highest_price >= item.reserve_price:
                        item.status = AuctionStatus.SOLD
                    else:
                        item.status = AuctionStatus.RESERVE_NOT_MET
                    
                    print(f'id, status = {item.id}, {item.status}')
                    item.save()

            elif now >= started:
                status_updated = False
                if item.status == AuctionStatus.NEW:
                    item.status = AuctionStatus.LIVE
                    status_updated = True
                
                elif item.status == AuctionStatus.LIVE:
                    if item.highest_price >= item.reserve_price and item.highest_price != 0:
                        item.status = AuctionStatus.LIVE_RESERVE_MET
                        status_updated = True

                if status_updated:
                    print(f'id, status = {item.id}, {item.status}')
                    item.save()
                
    except Exception as e:
        # Handle any exceptions gracefully
        print("An error occurred:", e)