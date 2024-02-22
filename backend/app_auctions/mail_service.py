from django.core.mail import send_mail
from django.conf import settings
import threading

class MailService:
    @staticmethod
    def send_email(subject, message, recipient_list):
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            recipient_list,
            fail_silently=False,
        )

    @staticmethod
    def send_email_async(subject, message, recipient_list):
        thread = threading.Thread(
            target=MailService.send_email,
            args=(subject, message, recipient_list)
        )
        thread.start()