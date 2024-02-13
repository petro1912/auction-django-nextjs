from django.urls import path
from .views import *


# def auction_create_view(_):
#     view = AuctionCreateView()
#     return view.create_auction()

# def auction_create_bid_view(request, pk):
#     view = AuctionCreateView()
#     return view.bid_in_auction(request, id=pk)

urlpatterns=[
    path('list', auction_list, name='auction-list'),
    path('detail/<int:id>', auction_detail, name='auction-detail'),
    path('create', auction_create_view, name='auction-create'),
    path('bid/<int:id>', auction_create_bid_view, name='bid-in-auction'),
]
