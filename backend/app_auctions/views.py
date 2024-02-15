# pylint: disable=unused-import
# pylint: disable=missing-docstring
# pylint: disable=unused-argument
# pylint: disable=trailing-whitespace
import os
import json
import uuid
from django.conf import settings
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from rest_framework.response import Response
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer
from rest_framework import status
from rest_framework.decorators import parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from .models import AuctionItem, AuctionBid
from .serializers import AuctionItemSerializer, AuctionBidSerializer
# Create your views here.

class AuctionStatus:
    NEW = 0
    LIVE = 1
    LIVE_RESERVE_MET = 2
    SOLD = 3
    EXPIRED = 4
    RESERVE_NOT_MET = 5
    
@api_view(['GET'])
@renderer_classes((JSONRenderer,))
def auction_list(request):
    items = AuctionItem.objects.prefetch_related('seller').all()
    serializer = AuctionItemSerializer(items, many=True)

    return Response({"status": "success", "data": serializer.data})

@api_view(['GET'])
@renderer_classes((JSONRenderer,))
def auction_detail(request, id):
    item = AuctionItem.objects.get(pk = id)
    now = timezone.now()
    if item.started_at < now and item.status == AuctionStatus.NEW:
        if item.ended_at > now:
            item.status = AuctionStatus.LIVE
        else:
            item.status = AuctionStatus.EXPIRED
        item.save()
    serializer = AuctionItemSerializer(item, many=False)

    return Response({"status": "success", "data": serializer.data})

def decode_items(form_data, seller):
    items = []
    for key, value in form_data.lists():
        if key.startswith('items'):
            print('value', value[0])
            item_data = json.loads(value[0])
            print('itemData', item_data)
            item = AuctionItem(
                seller=seller,
                description=item_data['description'],
                starting_price=float(item_data['starting_price']),
                reserve_price=float(item_data['reserve_price']),
                highest_price=0.0,
                categories=item_data['categories'],
                started_at=parse_datetime(item_data['started']),
                ended_at=parse_datetime(item_data['ended']),
            )
            items.append(item)
    return items

def upload_images(request):
    # Assuming formData is sent as POST request
    files = request.FILES
    uploaded_files = {}

    for key, file in files.lists():
        file = files[key]
        file_index = key.split("[")[1].split("]")[0]
        object_index, file_index_in_object = map(int, file_index.split('_'))
        
        extension = file.name.split('.')[-1]
        file_name = f'auction-{uuid.uuid4()}.{extension}'  
        file_url = f'/images/uploads/{file_name}'
        if object_index not in uploaded_files:
            uploaded_files[object_index] = file_url
        else:
            uploaded_files[object_index] += ',' + file_url
        
        # Save the file to the desired location
        file_path = os.path.join('images\\uploads', file_name)  # Define the path within MEDIA_ROOT
        with open(os.path.join(settings.MEDIA_ROOT, file_path), 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)
        
        print(uploaded_files)

    return uploaded_files


@api_view(['POST'])
@parser_classes((MultiPartParser, FormParser))
def auction_create_view(request):
    form_data = request.POST
    seller = request.user
    uploaded_files = upload_images(request)
    items = decode_items(form_data, seller)
    created_items = []
    index = 0
    for item in items:
        item.images = uploaded_files[index]
        item.save()
        created_items.append({
            'id': item.id,
            'description': item.description,
            'starting_price':  item.starting_price,
            'reserve_price':  item.reserve_price,
            'highest_price':  item.highest_price,
            'categories':  item.categories,
            'started_at':  item.started_at,
            'ended_at':  item.ended_at,
            'images': uploaded_files[index]
            # Add other fields as needed
        })
        index += 1
    return Response({'created_items': created_items})


@api_view(['POST'])
def auction_create_bid_view(request, id):
    data = request.data
    current_user = request.user
    if current_user is None:
        return Response({"status": "error"}, status=status.HTTP_401_UNAUTHORIZED)
    
    item = AuctionItem.objects.get(pk = id)
    auction_status = item.status
    bid_price = float(data['price'])
    data['buyer'] = current_user.id
    data['item'] = id
    data['is_highest'] = True

    print('data', data)
    
    if (
        auction_status != AuctionStatus.LIVE and 
        auction_status != AuctionStatus.LIVE_RESERVE_MET
    ):
        return Response({
            "status": "error", 
            "message": "The auction has not started or completed."
        })

    serializer = AuctionBidSerializer(data=data)
    high_bid = None
    try:
        high_bid = AuctionBid.objects.get(item_id=id, is_highest=True)
    except AuctionBid.DoesNotExist:
        print("No high bid found for item_id:", id)

    if high_bid is not None: 
        if high_bid.buyer.id == current_user.id:
            return Response({
                "status": "error", 
                "message": "You are already the highest bidder and cannot bid again at this time."
            })
        elif bid_price <= high_bid.price:
            return Response({
                "status": "error", 
                "message": "Bid price must not be lower than highest bid's."
            })
    elif bid_price <= item.starting_price:
        return Response({
            "status": "error", 
            "message": "Bid price must be greater than starting price."
        })
    
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    serializer.save()

    if bid_price >= item.reserve_price:
        item.status = AuctionStatus.LVE_RESERVE_MET
    
    item.highest_price = bid_price
    item.save()

    if high_bid is not None:
        high_bid.is_highest = False
        high_bid.save()

    return Response({"status": "success",  "data": serializer.data})
