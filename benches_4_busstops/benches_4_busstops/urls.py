"""bustops URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
import backend.api_views

urlpatterns = [
    path('api/thezero/v1/routes/', backend.api_views.FullRouteList.as_view()),
    path('api/thezero/v1/routes/distinct', backend.api_views.DistinctRouteList.as_view()),
    path('api/thezero/v1/stops/distinct', backend.api_views.DistinctStopList.as_view()),
    path('admin/', admin.site.urls),
]
