from django.urls import path
from .consumers import BidUpdateConsumer

websocket_urlpatterns = [
    path('ws/chat', BidUpdateConsumer.as_asgi()),
]