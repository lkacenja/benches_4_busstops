from django.urls import path, include
from . import api_views

urlpatterns = [
    path('api/thezero/v1/routes/', api_views.FullRouteList.as_view()),
    path('api/thezero/v1/routes/distinct', api_views.DistinctRouteList.as_view()),
    path('api/thezero/v1/stops/distinct', api_views.DistinctStopList.as_view()),
    path('api/thezero/v1/recording/create', api_views.RecordingCreate.as_view()),
]
