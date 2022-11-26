from rest_framework import serializers

from backend.models import Recording, Route, Stop

"""
Provides Serializers for serving our data via the API.
"""


class StopSerializer(serializers.ModelSerializer):
    """Serializes Stop models to simple id, name, coordinate sets."""

    class Meta:
        model = Stop
        fields = ['id', 'rtd_stop_name', 'coords', ]


class RouteSerializer(serializers.ModelSerializer):
    """Serializes Route models with included Stop model information."""
    stop = StopSerializer(read_only=True)

    class Meta:
        model = Route
        fields = ('id', 'rtd_route_id', 'rtd_route_long_name', 'rtd_stop_sequence', 'direction', 'stop')


class DistinctRouteSerializer(serializers.ModelSerializer):
    """Serializes distinct Route information for select lists."""

    class Meta:
        model = Route
        fields = ('id', 'rtd_route_id', 'rtd_route_long_name')


class RecordingSerializer(serializers.ModelSerializer):
    """Serializes user data for creating Recording objects."""

    class Meta:
        model = Recording
        fields = ['user_id', 'has_bench', 'stop']
