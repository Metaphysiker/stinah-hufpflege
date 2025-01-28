Add migrations:

Make sure database is running with: docker compose up --build

In docker-compose.yml in development, there is:

    #entrypoint: sh -c "cd WebApi && dotnet ef database update"

Maybe uncomment it.

Then:

docker compose run -it --entrypoint bash webapi

cd WebApi

dotnet ef migrations add NAME_OF_MIGRATIONS

After:

dotnet ef database update

# Swagger

http://localhost:8081/swagger/index.html

# Add nuget package

docker compose run dotnet bash

cd WebApi

dotnet add package AutoMapper --version 13.0.1

# psql Postgres Database

Get name of postgres container with

    docker ps

    docker exec -it stinah-hufpflege-development-postgres-1 /bin/bash

Then:

    psql -d abc -U abc

Then:

    Select \* From "Treatments"
