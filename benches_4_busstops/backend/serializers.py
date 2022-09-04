from rest_framework import serializers

from backend.models import Route, Stop, Recording


class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = ('id', 'rtd_route_id', 'rtd_route_long_name', 'rtd_stop_sequence', 'direction', 'stop')


class DistinctRouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = ('id', 'rtd_route_id', 'rtd_route_long_name')


class DistinctStopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stop
        fields = ['id', 'rtd_stop_name', 'coords']


class RecordingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recording
        fields = ['has_bench', 'stop']

