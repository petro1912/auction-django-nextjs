import os
import django
import threading

# Configure Django settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "main.settings")
django.setup()

from app_auctions.tasks import auction_task

def schedule_periodic_task(interval_seconds, task_func):
    def run_periodic_task():
        task_func()
        threading.Timer(interval_seconds, run_periodic_task).start()

    run_periodic_task()

if __name__ == "__main__":
    schedule_periodic_task(interval_seconds=30, task_func=auction_task)