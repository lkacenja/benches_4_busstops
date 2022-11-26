from django.apps import AppConfig

"""
Declare our frontend App.
"""


class FrontendConfig(AppConfig):
    """Implement the AppConfig class to provide our backend (API) app."""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'frontend'
