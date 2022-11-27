# Benches 4 Bus Stops (B4B)
Denver's Regional Transportation District (RTD) provides great public datasets
for bus and train services, real time vehicle tracking, routes, stops and even ridership.
However, RTD does not provide much information about the environs of their stops and stations.
Many of Denver's bus stops do not have much shelter or provide places to rest.
This creates issues of accessibility and equity, not to mention a barrier to the adoption as public transit.

This simple application is a prototype intended to crowdsource a bus stop, bench dataset.
The goal is to help activists, artists and communities organize requests to RTD and interventions that improve stops and stations.

## The Strategy
The B4B App provides two ways for users to answer whether a bus stop or station has a bench.
There is an individual stop logging option and an option for navigating an entire route.
The former is intended for incidental use. The latter is intended for use, while riding. While in route mode, the application is location enabled and leverages the PostGIS PostgreSQL extension to find the closest bus stop to a rider's current location.

To facilitate easy logging, B4B does not require creating any kind of account and is built with minimal and accessible theming. Data is collected anonymously based on hcaptcha session.
The application implements the [U.S. Web Design System (USWDS)](https://designsystem.digital.gov/), which emphasizes accessibility and mobile performance first.

## Running the App
B4B is built as a standard headless Django app. For local active development, I prefer to work within a container (see Dockerfile), but a standard virtual environment should work as well. Setting up and running the app goes something like:
1. Set up the .env file. You'll need to create [hcaptcha](https://www.hcaptcha.com/) and [Google Maps API keys](https://developers.google.com/maps/documentation/javascript/get-api-key) and populate them in a .env file (see example_env.txt within the repo).
2. Build Docker image, if this is the first run: `docker build -t benches_for_busstops .`
3. Run container `docker run -it --rm -v <path to repo>:/busstops -p 8000:8000 benches_for_busstops bash` This could be substituted with a direct call to begin the webserver.
4. Ensure Postgres is running `su postgres` and `service postgresql start`
5. Change directory to the application directory `/busstops/benches_4_busstops`
6. Run migrations `python3 manage.py migrate`
7. Run management script to load in RTD data: `python3 manage.py load_rtd_csv routes.csv`
8. Start up the server `python3 manage.py runserver 0.0.0.0:8000`

The front end is compiled via webpack. Node and NPM are not provided in the container right now. However, they could easily be installed, if desired. The procedure is something like:
1. Change directory to the application directory `/busstops/benches_4_busstops`
2. With Node/NPM installed inside the container or on the host machine, install the packages as you normally would, `npm install`.
3. Use `npm run watch` for development and `npm run build` before deployment.

## Todo
This application is a work in progress and prototype. There are a few more additions I'd like to make.
* Document scripts and process for transforming raw RTD data.
* Add location support for individual bus stop mode.
* Integrate TypeScript.
* Consider adding routing to the application.
