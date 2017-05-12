from datetime import date
import json

from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.contrib.auth.hashers import check_password

from rest_framework.test import APIRequestFactory
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token

import factory

from .models import Person


class RandomPersonFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Person

    birthday = factory.LazyFunction(date.today)
    user = None


class RandomUserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = get_user_model()

    username = factory.Sequence(lambda n: "user_%d" % n)
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    password = factory.Faker('password')
    person = factory.RelatedFactory(RandomPersonFactory, 'user')


class AreaTestCase(APITestCase):
    def setUp(self):
        self.user = RandomUserFactory.build()

    def test_views(self):
        # Check Register
        payload = {
                'username': self.user.username,
                'password': self.user.password,
                'first_name': self.user.first_name,
                'last_name': self.user.last_name
            }
        response = self.client.post(reverse('area:api_register'),
            payload, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['last_name'], self.user.last_name)
        self.assertEqual(response.data['first_name'], self.user.first_name)
        self.assertEqual(response.data['username'], self.user.username)
        self.token = response.data['token']
        self.assertEqual(Token.objects.get(key=self.token).user.username,
            self.user.username)
        # Check Login
        payload = {
                'username': self.user.username,
                'password': 'xxxx1234',
            }
        response = self.client.post(
            reverse('area:api_login'),
            format='json')
        self.assertEqual(response.status_code, 400)
        payload = {
                'username': self.user.username,
                'password': self.user.password,
            }
        response = self.client.post(reverse('area:api_login'),
            payload, format='json')
        self.assertEqual(response.status_code, 200)
        # Check Person retreiving
        # set AUTH
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)
        response = self.client.get(reverse('area:api_person'),
            payload, format='json')
        # Check Person updating
        updated_user = RandomUserFactory.build()
        # check if the new info does not exist
        with self.assertRaises(get_user_model().DoesNotExist):
            get_user_model().objects.get(username=updated_user.username)
        payload = {
            'user': {
                'password': updated_user.password,
                'first_name': updated_user.first_name,
                'last_name': updated_user.last_name
            },
            'birthday': updated_user.person.birthday
        }
        response = self.client.put(reverse('area:api_person'),
            payload, format='json')
        self.assertEqual(response.status_code, 200)
        user = Token.objects.get(key=self.token).user
        self.assertEqual(updated_user.first_name, user.first_name)
        self.assertEqual(updated_user.last_name, user.last_name)
        self.assertTrue(check_password(updated_user.password, user.password))
        # Check if the password is blank
        payload['user']['password'] = ''
        response = self.client.put(reverse('area:api_person'),
            payload, format='json')
        # the password may not be blank
        self.assertEqual(response.status_code, 400)
        self.assertTrue(check_password(updated_user.password, user.password))
        # Check empty password
        del payload['user']['password']
        response = self.client.put(reverse('area:api_person'),
            payload, format='json')
        self.assertEqual(response.status_code, 200)
        #import ipdb;ipdb.set_trace()
        user = Token.objects.get(key=self.token).user
        self.assertTrue(check_password(updated_user.password, user.password))