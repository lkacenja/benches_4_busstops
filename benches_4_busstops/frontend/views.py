from django.shortcuts import render
from benches_4_busstops.environment import get_env_variable


def app(request):
    secrets = {
        'hcaptcha_site_key': get_env_variable('HCAPTCHA_SITE_KEY'),
        'google_maps_api_key': get_env_variable('GOOGLE_MAPS_API_KEY')
    }
    return render(request, 'frontend/app.html', context={'secrets': secrets})
