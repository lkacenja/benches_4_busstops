# Generated by Django 4.1 on 2022-08-23 03:12

import django.contrib.gis.db.models.fields
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Stop',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rtd_stop_name', models.CharField(max_length=255)),
                ('coords', django.contrib.gis.db.models.fields.PointField(srid=4326)),
            ],
        ),
        migrations.CreateModel(
            name='Route',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rtd_route_id', models.CharField(max_length=25)),
                ('rtd_route_long_name', models.CharField(max_length=255)),
                ('rtd_stop_sequence', models.IntegerField()),
                ('direction', models.CharField(max_length=25)),
                ('stop', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='route_stop', to='backend.stop')),
            ],
        ),
        migrations.CreateModel(
            name='Recording',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('has_bench', models.BooleanField()),
                ('stop', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='recording_stop', to='backend.stop')),
            ],
        ),
    ]
