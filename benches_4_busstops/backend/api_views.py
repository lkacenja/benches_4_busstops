from rest_framework.generics import ListAPIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from rest_framework.pagination import LimitOffsetPagination

from backend.serializers import RouteSerializer, DistinctRouteSerializer, DistinctStopSerializer
from backend.models import Route, Stop


class BackendPagination(LimitOffsetPagination):
    default_limit = 10
    max_limit = 100


class FullRouteList(ListAPIView):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter)
    filter_fields = ('rtd_route_id', 'stop_id')
    search_fields = 'rtd_route_long_name'
    pagination_class = BackendPagination

class DistinctRouteList(ListAPIView):
    queryset = Route.objects.distinct('rtd_route_id')
    serializer_class = DistinctRouteSerializer

class DistinctStopList(ListAPIView):
    queryset = Stop.objects.distinct('rtd_stop_name')
    serializer_class = DistinctStopSerializer

