from rest_framework.generics import ListAPIView, CreateAPIView
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import GEOSGeometry

from backend.serializers import RouteSerializer, StopSerializer, DistinctRouteSerializer, RecordingSerializer
from backend.models import Route, Stop


class FullRouteList(ListAPIView):
    serializer_class = RouteSerializer
    queryset = Route.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ['rtd_route_id', ]


class DistinctRouteList(ListAPIView):
    serializer_class = DistinctRouteSerializer
    queryset = Route.objects.distinct('rtd_route_id').order_by('rtd_route_id')


class StopList(ListAPIView):
    serializer_class = StopSerializer

    def get_queryset(self):
        coords_string = self.request.query_params.get('coords')
        rtd_route_id = self.request.query_params.get('rtd_route_id')
        direction = self.request.query_params.get('direction')
        if coords_string and rtd_route_id and direction:
            coords = GEOSGeometry(coords_string, srid=900913)
            stop_ids = Route.objects.filter(rtd_route_id=rtd_route_id, direction=direction).values_list('stop',
                                                                                                        flat=True)
            return Stop.objects.filter(id__in=stop_ids).annotate(
                distance=Distance('coords', coords, spheroid=True)
            ).order_by('distance')[:1]
        else:
            return Stop.objects.all().order_by('rtd_stop_name')


class CreateListModelMixin(object):

    def get_serializer(self, *args, **kwargs):
        """ if an array is passed, set serializer to many """
        if isinstance(kwargs.get('data', {}), list):
            kwargs['many'] = True
        return super(CreateListModelMixin, self).get_serializer(*args, **kwargs)


class RecordingCreate(CreateListModelMixin, CreateAPIView):
    serializer_class = RecordingSerializer
