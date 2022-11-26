from django.contrib.gis.db import models

"""
Provides models that represent RTD Stops, Routes and our app's recorded data.
"""


class Stop(models.Model):
    """A model that represents a single RTD stop."""
    rtd_stop_name = models.CharField(max_length=255)
    coords = models.PointField(geography=False, srid=900913)


class Route(models.Model):
    """
    A model that represents an RTD Stop on a Route.

    Notes
    -----
    An RTD Route is represented by multiple rows in this table.
    Each row correlates to a single stop on a route in a given direction.
    """
    rtd_route_id = models.CharField(max_length=25)
    rtd_route_long_name = models.CharField(max_length=255)
    rtd_stop_sequence = models.IntegerField()
    direction = models.CharField(max_length=25)
    stop = models.ForeignKey(to=Stop, on_delete=models.CASCADE, related_name='route_stop')


class Recording(models.Model):
    """A model that tracks whether a stop has a bench."""
    created = models.DateTimeField(auto_now_add=True)
    has_bench = models.BooleanField()
    user_id = models.CharField(max_length=255)
    stop = models.ForeignKey(to=Stop, on_delete=models.CASCADE, related_name='recording_stop')
