from settings import *

# Database
# https://docs.djangoproject.com/en/1.9/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    },
    'pgsql': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'dummy',
        'USER': 'vagrant',
        'PASSWORD': 'vagrant',
        'TEST': {'NAME': 'test_trainee'},
    },
    'mysql': {
        #'ENGINE': 'django.db.backends.mysql',
        'OPTIONS': {
            'sql_mode': 'STRICT_TRANS_TABLES',
        },
        'NAME': 'trainee',
        'USER': 'vagrant',
        'TEST': {'NAME': 'test_trainee'},
    }
}


if os.environ.get('TESTING', None):
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
        }
    }
