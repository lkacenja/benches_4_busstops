from rest_framework import serializers

from backend.models import Route, Stop

from drf_dynamic_fields import DynamicFieldsMixin


class RouteSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = ('rtd_route_id', 'rtd_route_long_name', 'rtd_stop_sequence', 'direction', 'stop')


class DistinctRouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = ('rtd_route_id', 'rtd_route_long_name')


class DistinctStopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stop
        fields = ['rtd_stop_name']
