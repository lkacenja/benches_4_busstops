import os

from dotenv import dotenv_values

"""
Environmental utilities.
"""


def is_production_environment() -> bool:
    """
    Determines whether this is the production environment.

    Returns
    -------
    bool
      Whether this is the production environment.
    """
    if os.environ.get('PRODUCTION'):
        return True
    return False


def get_env_variable(name: str):
    """
    Gets an application variable from the correct place for the current environment.

    Notes
    -----
    Currently supports .env variables (python-dotenv) for development and standard environment variables for production.

    Parameters
    ----------
    name: str
      The name of the variable to get.

    Returns
    -------
      The value for the variable.
    """
    if is_production_environment():
        # If we are in production, check for an environmental variable.
        # This works well for Heroku.
        value = os.environ.get(name)
        if not value:
            message = 'Mode is production. Missing environment variable, {variable_name}.'.format(variable_name=name)
            raise Exception(message)
    else:
        # Otherwise look for a python-dotenv variable.
        env_values = dotenv_values('.env')
        if name not in env_values:
            message = 'Mode is development. Missing environment variable, {variable_name}. Check .env'.format(
                variable_name=name)
            raise Exception(message)
        value = env_values[name]
    return value
