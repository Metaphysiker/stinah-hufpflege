Add migrations:

Make sure database is running with: docker compose up --build

In docker-compose.yml in development, there is:

    #entrypoint: sh -c "cd WebApi && dotnet ef database update"

Maybe uncomment it.

Then:

docker compose run dotnet bash

#In production: docker compose -f docker-compose.remote.yml run -it --entrypoint bash webapi

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

# Restore backup from infomaniak

First, inside infomaniak-server folder:

    ./create-backup-from-infomaniak-server.sh /home/sandro/backups/stinah-pflege

Then, inside development folder:

    ./pg-restore-from-dump-file.sh /home/sandro/backups/stinah-pflege/dump_2025-02-04_23_17_57.dump
