# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-04-26 12:22
from __future__ import unicode_literals

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('area', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='person',
            name='birthday',
            field=models.DateField(default=datetime.date.today),
        ),
    ]
