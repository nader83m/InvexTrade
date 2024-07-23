import os
from pathlib import Path
"""Flask app configuration."""
from os import environ, path
from dotenv import load_dotenv
basedir = Path(__file__).parent.parent


class DataBaseConfig(object):
    POSTGRES_URL = 'localhost:5432'
    POSTGRES_USER = 'postgres'
    POSTGRES_PASS = '123'
    POSTGRES_DB = 'testdb'

    def create_db_url(self):
        return 'postgresql+psycopg2://{user}:{pw}@{url}/{db}'.format(user=self.POSTGRES_USER, pw=self.POSTGRES_PASS, url=self.POSTGRES_URL, db=self.POSTGRES_DB)


class Config:
    """Set Flask configuration from environment variables."""

    FLASK_APP = 'wsgi.py'
    FLASK_ENV = environ.get('FLASK_ENV')
    SECRET_KEY = environ.get('SECRET_KEY')

    # Flask-Assets
    LESS_BIN = environ.get('LESS_BIN')
    ASSETS_DEBUG = environ.get('ASSETS_DEBUG')
    LESS_RUN_IN_DEBUG = environ.get('LESS_RUN_IN_DEBUG')

    # Static Assets
    STATIC_FOLDER = 'static'
    TEMPLATES_FOLDER = 'templates'
    COMPRESSOR_DEBUG = environ.get('COMPRESSOR_DEBUG')

    # Flask-SQLAlchemy
    SQLALCHEMY_DATABASE_URI = environ.get('SQLALCHEMY_DATABASE_URI')
    SQLALCHEMY_ECHO = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False