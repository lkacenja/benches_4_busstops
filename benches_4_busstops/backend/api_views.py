from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import GEOSGeometry
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.generics import CreateAPIView, ListAPIView

from backend.models import Route, Stop
from backend.serializers import (DistinctRouteSerializer, RecordingSerializer,
                                 RouteSerializer, StopSerializer)

"""
Provides the views that make up our API.
"""


class FullRouteList(ListAPIView):
    """A list of all Route objects filterable by an RTD Route ID (rtd_route_id) parameter."""
    serializer_class = RouteSerializer
    queryset = Route.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ['rtd_route_id', ]


class DistinctRouteList(ListAPIView):
    """Provides a list of distinct Route objects, ideal for select lists."""
    serializer_class = DistinctRouteSerializer
    queryset = Route.objects.distinct('rtd_route_id').order_by('rtd_route_id')


class StopList(ListAPIView):
    """
    Provides a list of Stop objects, filterable by proximity.

    Notes
    -----
    Filtering by proximity requires coords, direction and rtd_route_id parameters.
    """
    serializer_class = StopSerializer

    def get_queryset(self):
        """Overrides the ListAPIView get_queryset method to allow proximity filtration."""
        coords_string = self.request.query_params.get('coords')
        rtd_route_id = self.request.query_params.get('rtd_route_id')
        direction = self.request.query_params.get('direction')
        # All three of the above route parameters are required for proximity filtration.
        if coords_string and rtd_route_id and direction:
            # The below ORM call requires a metric srid, 900913.
            # This allows us to use a geometric, instead of geographic calculation.
            # The latter was not very accurate.
            coords = GEOSGeometry(coords_string, srid=900913)
            # We are onl interest in Stop objects that belong to this route.
            # However, the foreign key points the other direction.
            # This requires a two-step lookup.
            stop_ids = Route.objects.filter(rtd_route_id=rtd_route_id, direction=direction).values_list('stop',
                                                                                                        flat=True)
            # Of the filtered Stop objects, return the closest.
            return Stop.objects.filter(id__in=stop_ids).annotate(
                distance=Distance('coords', coords, spheroid=True)
            ).order_by('distance')[:1]
        else:
            return Stop.objects.all().order_by('rtd_stop_name')


class CreateListModelMixin(object):
    """A mixin that allows for creating multiple models in one request."""

    def get_serializer(self, *args, **kwargs):
        # If an array is passed, set serializer to many.
        if isinstance(kwargs.get('data', {}), list):
            kwargs['many'] = True
        return super(CreateListModelMixin, self).get_serializer(*args, **kwargs)


class RecordingCreate(CreateListModelMixin, CreateAPIView):
    """Provides a Recording model creation endpoint."""
    serializer_class = RecordingSerializer
