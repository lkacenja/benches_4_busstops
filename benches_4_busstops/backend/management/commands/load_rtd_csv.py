import csv

from django.contrib.gis.geos import GEOSGeometry
from django.core.management import BaseCommand

from backend.models import Route, Stop

"""
A management command for importing RTD data into our application database.
"""


class Command(BaseCommand):
    """
    Imports RTD Data into our application database.

    Notes
    -----
    This command may be invoked via the Django management script.
    ```
    python manage.py load_rtd_csv <data to import>
    ```
    """
    help = "Loads Stops and Routes from a CSV file."

    def add_arguments(self, parser):
        """Overrides the BaseCommand add_arguments method to include a "file_path" argument."""
        parser.add_argument("file_path", type=str)

    def handle(self, *args, **options):
        """Overrides the BaseCommand handle method to do our work."""
        file_path = options["file_path"]
        with open(file_path, "r") as csv_file:
            data = csv.reader(csv_file, delimiter=",")
            header = next(data)
            stops = {}
            routes = []
            # Empty the Route and Stop tables.
            # Leave other tables alone as to not jeopardize any user created data.
            Route.objects.all().delete()
            Stop.objects.all().delete()
            # Iterate over the csv data and create our models.
            for row in data:
                row = dict(zip(header, row))
                # Stops may be included in numerous routes.
                # Make sure we create each stop model only one time.
                if row['stop_name'] not in stops:
                    # Create and store the stop, so that we have a pkey for the route.
                    stops[row['stop_name']] = Stop.objects.create(
                        rtd_stop_name=row['stop_name'],
                        coords=GEOSGeometry('POINT(' + row['stop_lat'] + ' ' + row['stop_lon'] + ')', srid=900913)
                    )
                # Build and store route objects to save at the end.
                route = Route(
                    rtd_route_id=row['route_id'],
                    rtd_route_long_name=row['route_long_name'],
                    rtd_stop_sequence=row['stop_sequence'],
                    direction=row['direction_id'],
                    stop=stops[row['stop_name']],
                )
                routes.append(route)
            # Save all the route objects at once.
            Route.objects.bulk_create(routes)
