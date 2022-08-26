from django.contrib.gis.db import models

class Stop(models.Model):
    rtd_stop_name = models.CharField(max_length=255)
    coords = models.PointField()



class Route(models.Model):
    rtd_route_id = models.CharField(max_length=25)
    rtd_route_long_name = models.CharField(max_length=255)
    rtd_stop_sequence = models.IntegerField()
    direction = models.CharField(max_length=25)
    stop = models.ForeignKey(to=Stop, on_delete=models.CASCADE, related_name='route_stop')


class Recording(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    has_bench = models.BooleanField()
    stop = models.ForeignKey(to=Stop, on_delete=models.CASCADE, related_name='recording_stop')
