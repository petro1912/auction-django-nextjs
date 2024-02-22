# pylint: disable=missing-docstring
# pylint: disable=missing-final-newline
from django.apps import AppConfig


class AppAuctionsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app_auctions'

    def ready(self):
        import app_auctions.receivers
