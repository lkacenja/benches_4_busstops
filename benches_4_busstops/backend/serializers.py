from rest_framework import serializers

from backend.models import Route, Stop, Recording


class StopSerializer(serializers.ModelSerializer):
    distance = serializers.SerializerMethodField()

    def get_distance(self, obj):
        return obj.distance.m
    class Meta:
        model = Stop
        fields = ['id', 'rtd_stop_name', 'coords', 'distance']


class RouteSerializer(serializers.ModelSerializer):
    stop = StopSerializer(read_only=True)

    class Meta:
        model = Route
        fields = ('id', 'rtd_route_id', 'rtd_route_long_name', 'rtd_stop_sequence', 'direction', 'stop')


class DistinctRouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = ('id', 'rtd_route_id', 'rtd_route_long_name')


class RecordingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recording
        fields = ['user_id', 'has_bench', 'stop']
