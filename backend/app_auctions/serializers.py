# pylint: disable=missing-docstring
from rest_framework import serializers
from .models import AuctionItem, AuctionBid
from app_auth.serializers import UserSerializer
from app_auth.models import Account

class AuctionBidSerializer(serializers.ModelSerializer):
    # buyer = serializers.SerializerMethodField()
    # item = serializers
    class Meta:
        model = AuctionBid
        fields = [
            'id', 
            'buyer', 
            'price',
            'item',
            'is_highest', 
            'created_at'
        ]

class AuctionItemSerializer(serializers.ModelSerializer):
    auctionbids =  AuctionBidSerializer(many=True, read_only=True)
    images = serializers.ListField(child=serializers.CharField(), read_only=True)
    seller = UserSerializer()

    class Meta:
        model = AuctionItem
        fields = [
            'id', 
            'seller',
            'description', 
            'categories', 
            'images', 
            'started_at', 
            'ended_at', 
            'starting_price', 
            'highest_price', 
            'status', 
            'auctionbids'
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Split the string value of images into a list
        representation['images'] = instance.images.split(',') if instance.images else []
        auctionbids = instance.auctionbid_set.all()
        auctionbids_serializer = AuctionBidSerializer(auctionbids, many=True)
        representation['auctionbids'] = auctionbids_serializer.data

        return representation