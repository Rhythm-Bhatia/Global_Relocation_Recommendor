from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.triggers.date import DateTrigger
import asyncio
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()

def start_scheduler(data_fetcher):
    """Start the scheduler for periodic data updates"""
    
    async def refresh_data_job():
        """Job to refresh country data"""
        try:
            logger.info("Starting scheduled data refresh...")
            await data_fetcher.fetch_and_store_data()
            logger.info("Scheduled data refresh completed successfully")
        except Exception as e:
            logger.error(f"Error during scheduled data refresh: {e}")
    
    # Schedule first run after 1 minute
    first_run = datetime.now() + timedelta(minutes=1)
    scheduler.add_job(
        refresh_data_job,
        DateTrigger(run_date=first_run),
        id='first_data_refresh',
        name='First Data Refresh'
    )
    
    # Schedule recurring job every 6 hours
    scheduler.add_job(
        refresh_data_job,
        IntervalTrigger(hours=6),
        id='recurring_data_refresh',
        name='Recurring Data Refresh'
    )
    
    scheduler.start()
    logger.info("Scheduler started - first refresh in 1 minute, then every 6 hours")

def stop_scheduler():
    """Stop the scheduler"""
    scheduler.shutdown()
    logger.info("Scheduler stopped")