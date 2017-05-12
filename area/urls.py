from django.conf.urls import url
from django.views.generic import TemplateView

from rest_framework.authtoken import views as rest_auth

import views

app_name = 'area'

urlpatterns = [
    url(r'^api-users/$', views.ListUsers.as_view(), name='api_list_users'),
    url(r'^api-register/$', views.RegisterView.as_view(), name='api_register'),
    url(r'^api-person/$', views.PersonView.as_view(), name='api_person'),
    url(r'^api-token-auth/$', views.LoginView.as_view(), name='api_login'),
    url(r'^', views.index, name='index'),
]
