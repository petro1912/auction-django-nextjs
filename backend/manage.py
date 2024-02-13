#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
import threading

def schedule_periodic_task(interval_seconds, task_func):
    def run_periodic_task():
        task_func()
        threading.Timer(interval_seconds, run_periodic_task).start()

    run_periodic_task()

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)

    # Schedule the periodic task
    from app_auctions.tasks import auction_task
    schedule_periodic_task(interval_seconds=60, task_func=auction_task)

if __name__ == '__main__':
    main()
