# Generated by Django 4.1 on 2022-10-01 23:12

import django.contrib.gis.db.models.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0002_recording_user_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stop',
            name='coords',
            field=django.contrib.gis.db.models.fields.PointField(srid=900913),
        ),
    ]
