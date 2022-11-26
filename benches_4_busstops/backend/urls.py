from django.urls import include, path

from . import api_views

"""
Provides Django application urls for our backend (API).
"""

# Provide our API endpoints.
# As a miniscule, bot defense add a random(ish) string to the URL.
# That way our API isn't sitting at /api.
urlpatterns = [
    path('api/thezero/v1/routes', api_views.FullRouteList.as_view()),
    path('api/thezero/v1/routes/distinct', api_views.DistinctRouteList.as_view()),
    path('api/thezero/v1/stops', api_views.StopList.as_view()),
    path('api/thezero/v1/recording/create', api_views.RecordingCreate.as_view()),
]
