from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import AuctionItem, AuctionBid, AuctionStatus
from django.core.serializers import serialize
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .mail_service import MailService

@receiver(post_save, sender=AuctionItem)
def send_email_for_seller(sender, instance, created, **kwargs):
    print(f"AuctionItem: {instance}")
    seller_email = instance.seller.email
    recipient_list = [seller_email]
    message = ""

    if created:
        
        subject = "Auction Created"
        message = f"Your auction item has been successfully created.\n you can check it. https://3.17.152.211/auction/detail/{instance.id}"
        
        print(subject)
        print(message)
        # MailService.send_email_async(subject, message, recipient_list)

    else:

        status = instance.status
        subject = "Auction Status Updated"
        if instance.ended_at < timezone.now():
            return

        if status == AuctionStatus.EXPIRED:
            message = f"Your auction has been expired without any bid.\n you can check it. https://3.17.152.211/auction/detail/{instance.id}"
        elif status == AuctionStatus.RESERVE_NOT_MET:
            message = f"Your auction has been ended without any expected bid.\n you can check the following link in detail.  https://3.17.152.211/auction/detail/{instance.id}"
        elif status == AuctionStatus.SOLD:
            message = f"Your auction has been ended with expected bid.\n Highest bid price is {instance.highest_price}$. you can check the following link in detail. https://3.17.152.211/auction/detail/{instance.id}"
        elif status == AuctionStatus.LIVE:
            message = f"Your auction has been started right now.\n You can check the following link in detail. https://3.17.152.211/auction/detail/{instance.id}"
        elif status == AuctionStatus.LIVE_RESERVE_MET:
            message = f"Highest bid has been placed in your auction.\n You can check the following link in detail. https://3.17.152.211/auction/detail/{instance.id}"
            
        print(subject)
        print(message)
        # MailService.send_email_async(subject, message, recipient_list)

        if status == AuctionStatus.SOLD:
            try:

                subject = "Auction Bid Status"
                bid = AuctionBid.objects.filter(item = instance.id, is_highest = True)[:1].get()
                recipient_list = [bid.buyer.email]
                message = f"Your bid has won the auction.\n You can check the following link in detail. https://3.17.152.211/auction/detail/{instance.id}"

                # MailService.send_email_async(subject, message, recipient_list)

            except:
                pass

        elif status == AuctionStatus.LIVE_RESERVE_MET:
            try:
                subject = "Auction Bid Status"
                bids = AuctionBid.objects.filter(item = instance.id)[:2].get()

                for bid in bids:
                    recipient_list = [bid.buyer.email]

                    if bid.is_highest:
                        message = f"You has reached the highest bidder.\n You can check the following link in detail. https://3.17.152.211/auction/detail/{instance.id}"
                    else:
                        message = f"Someone has reached the highest bidder.\n You can check the following link in detail. https://3.17.152.211/auction/detail/{instance.id}" 

                    print(subject)
                    print(message)    
                    # MailService.send_email_async(subject, message, recipient_list)    

            except:
                pass
