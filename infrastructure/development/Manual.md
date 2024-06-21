Add migrations:

Make sure database is running with: docker compose up --build

In docker-compose.yml in development, there is:

    #entrypoint: sh -c "cd WebApi && dotnet ef database update"

Maybe uncomment it.

Then:

docker compose run dotnet bash

cd WebApi

dotnet ef migrations add NAME_OF_MIGRATIONS

After:

dotnet ef database update
