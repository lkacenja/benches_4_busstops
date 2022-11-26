from django.urls import path

from . import views

"""
Provides Django application urls for our frontend.
"""

# For now, serve everything from '/'.
# If we implement front end routing later on, this may need tweaking.
urlpatterns = [
    path('', views.app),
]
