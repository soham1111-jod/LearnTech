import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'changeme')
    MONGO_URI = os.getenv('MONGO_URI')
    # Add any other config variables you need 