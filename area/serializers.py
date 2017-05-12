import datetime

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

from rest_framework import serializers

from .models import Person


class TokenSerializer(serializers.Serializer):
    token = serializers.CharField()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = (
            'username',
            'password',
            'first_name',
            'last_name',
            'email',
        )
        extra_kwargs = {
            'password': {
                'validators': [validate_password],
                'write_only': True,
            }
        }

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        person = Person.objects.create(user=user)
        return user


class PersonSerializer(serializers.ModelSerializer):
    user = UserSerializer(allow_null=True, required=False, partial=True)

    class Meta:
        model = Person
        fields = (
            'user',
            'birthday',
            'tags',
        )

    def update(self, instance, validated_data):
        # Profile Info
        instance.birthday = validated_data.get('birthday',
                                               instance.birthday)
        instance.save()
        #import ipdb;ipdb.set_trace()
        # User instance Info
        if 'user' in validated_data:
            user_info = validated_data['user']
            if 'password' in user_info and user_info['password']:
                instance.user.set_password(user_info['password'])
            instance.user.email = user_info.get(
                'email', instance.user.email)
            instance.user.first_name = user_info.get(
                'first_name', instance.user.first_name)
            instance.user.last_name = user_info.get(
                'last_name', instance.user.last_name)
            instance.user.save()
        return instance
