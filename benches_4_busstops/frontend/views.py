from django.shortcuts import render
from dotenv import dotenv_values


def app(request):
    env_values = dotenv_values('.env')
    secrets = {
        'hcaptcha_site_key': env_values['HCAPTCHA_SITE_KEY'],
        'google_maps_api_key': env_values['GOOGLE_MAPS_API_KEY']
    }
    return render(request, 'frontend/app.html', context={'secrets': secrets})
