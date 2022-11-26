from django.contrib import admin
from django.urls import include, path

"""
Provides front end and backend urls for our Django app.
"""

urlpatterns = [
    path('', include('backend.urls')),
    path('', include('frontend.urls')),
    path('admin/', admin.site.urls),
]
