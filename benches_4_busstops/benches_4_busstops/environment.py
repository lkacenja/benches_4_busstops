import os
from dotenv import dotenv_values


def get_env_variable(name: str):
    if os.environ.get('PRODUCTION'):
        value = os.environ.get(name)
        if not value:
            message = 'Mode is production. Missing environment variable, {variable_name}.'.format(variable_name=name)
            raise Exception(message)
    else:
        env_values = dotenv_values('.env')
        if name not in env_values:
            message = 'Mode is development. Missing environment variable, {variable_name}. Check .env'.format(
                variable_name=name)
            raise Exception(message)
        value = env_values[name]
    return value
