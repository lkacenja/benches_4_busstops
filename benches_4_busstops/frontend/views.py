from django.shortcuts import render

from benches_4_busstops.environment import get_env_variable

"""
Provides views for the frontend application.
"""


def app(request):
    """
    Serves a very minimal application shell for our front end.

    Parameters
    ----------
    request: HttpRequest
      A Django request object.

    Returns
    -------
      An HttpResponse object.
    """
    # Pass API keys and environmental information through to the application.
    secrets = {
        'hcaptcha_site_key': get_env_variable('HCAPTCHA_SITE_KEY'),
        'google_maps_api_key': get_env_variable('GOOGLE_MAPS_API_KEY')
    }
    return render(request, 'frontend/app.html',
                  context={'secrets': secrets, 'google_analytics_key': get_env_variable('GOOGLE_ANALYTICS_KEY')})
