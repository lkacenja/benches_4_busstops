from django.apps import AppConfig

"""
Declare our backend (API) app.
"""


class BackendConfig(AppConfig):
    """Implement the AppConfig class to provide our backend (API) app."""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend'
