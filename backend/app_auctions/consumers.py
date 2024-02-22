from channels.generic.websocket import AsyncWebsocketConsumer
import uuid
import json

class BidUpdateConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.channel_name = uuid.uuid4()
        
        await self.accept()

    async def receive(self, text_data):
        data = json.loads(text_data)
        group_name = data.get('group')

        if group_name:
            await self.channel_layer.group_add(
                group_name,
                self.channel_name
            )

    async def send_message(self, event):
        # Send the message to the WebSocket client
        message = event['message']
        print(message)
        await self.send(text_data=json.dumps({
            'message': message
        }))
    

    async def disconnect(self, close_code):
        # Leave the group or channel        
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )