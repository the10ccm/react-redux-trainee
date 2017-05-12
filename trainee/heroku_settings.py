from settings import *
import dj_database_url

DATABASES = {}
DATABASES['default'] =  dj_database_url.config()


if os.environ.get('TESTING', None):
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
        }
    }

