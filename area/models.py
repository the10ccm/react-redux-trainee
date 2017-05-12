from __future__ import unicode_literals
from datetime import date

from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from rest_framework.authtoken.models import Token


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


class Person(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, related_name='person',
                             on_delete=models.CASCADE)
    birthday = models.DateField(default=date.today)
    tags = models.ManyToManyField('Tag', verbose_name="list of tags",
                                  related_name='persons', blank=True)

    def __str__(self):
        return "{0} {1}".format(self.user.first_name, self.user.username)


class Tag(models.Model):
    name = models.CharField(max_length=32)

    def __str__(self):
        return self.name


class Photo(models.Model):
    photo = models.CharField(max_length=255)
    person = models.ForeignKey('Person', related_name='photos')
