import csv
from django.core.management import BaseCommand
from django.contrib.gis.geos import GEOSGeometry

from backend.models import Stop
from backend.models import Route

class Command(BaseCommand):
    help = "Loads Stops and Routes from a CSV file."


    def add_arguments(self, parser):
        parser.add_argument("file_path", type=str)


    def handle(self, *args, **options):
        file_path = options["file_path"]
        with open(file_path, "r") as csv_file:
            data = csv.reader(csv_file, delimiter=",")
            header = next(data)
            stops = {}
            routes = []
            Route.objects.all().delete()
            Stop.objects.all().delete()
            for row in data:
                row = dict(zip(header, row))
                if row['stop_name'] not in stops:
                    stops[row['stop_name']] = Stop.objects.create(
                        rtd_stop_name=row['stop_name'],
                        coords=GEOSGeometry('POINT(' + row['stop_lat'] + ' ' + row['stop_lon'] + ')')
                    )
                route = Route(
                    rtd_route_id=row['route_id'],
                    rtd_route_long_name=row['route_long_name'],
                    rtd_stop_sequence=row['stop_sequence'],
                    direction=row['direction_id'],
                    stop=stops[row['stop_name']],
                )
                routes.append(route)
            Route.objects.bulk_create(routes)
