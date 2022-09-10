from rest_framework.generics import ListAPIView, CreateAPIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import LimitOffsetPagination

from backend.serializers import RouteSerializer, DistinctRouteSerializer, DistinctStopSerializer, RecordingSerializer
from backend.models import Route, Stop


class BackendPagination(LimitOffsetPagination):
    default_limit = 10
    max_limit = 100


class FullRouteList(ListAPIView):
    serializer_class = RouteSerializer
    queryset = Route.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ['rtd_route_id', ]


class DistinctRouteList(ListAPIView):
    serializer_class = DistinctRouteSerializer
    queryset = Route.objects.distinct('rtd_route_id')


class DistinctStopList(ListAPIView):
    serializer_class = DistinctStopSerializer
    queryset = Stop.objects.distinct('rtd_stop_name')


class RecordingCreate(CreateAPIView):
    serializer_class = RecordingSerializer
