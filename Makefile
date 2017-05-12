PROJECT_NAME=area
BIND_TO=0.0.0.0
RUNSERVER_PORT=8080

SETTINGS=trainee.local_settings
LOCAL_BRANCH=master

HEROKU_SETTINGS=trainee.heroku_settings
HEROKU_APP_NAME=the10ccm-trainee


STATICS=static

TEST_OPTIONS=
TEST_APP?=area


MANAGE= PYTHONPATH=$(PYTHONPATH) DJANGO_SETTINGS_MODULE=$(SETTINGS) \
	django-admin.py


herokudeploy:
	heroku config:set DJANGO_SETTINGS_MODULE=$(HEROKU_SETTINGS) --app $(HEROKU_APP_NAME)
	#git checkout $(LOCAL_BRANCH)
	git push heroku $(LOCAL_BRANCH):master
	heroku run python manage.py migrate --traceback --app $(HEROKU_APP_NAME)

run:
	@echo Starting $(PROJECT_NAME)...
	$(MANAGE) runserver $(BIND_TO):$(RUNSERVER_PORT)

clean:
	find . -name '*.pyc' -delete

test:
	@echo Testing $(PROJECT_NAME)...
	TESTING=YES $(MANAGE) test $(TEST_OPTIONS) $(TEST_APP)

migrate:
	$(MANAGE) migrate

dumpdata:
	$(MANAGE) dumpdata

shell:
	$(MANAGE) shell

dbshell:
	$(MANAGE) dbshell

mysqlinit:
	echo "CREATE USER 'vagrant'@'localhost' " | mysql -uroot
	echo "GRANT ALL ON *.* TO 'vagrant'@'localhost'" | mysql -uroot
