#!/bin/bash

path_to_dump="$1"

# copy file to docker container
docker cp $path_to_dump stinah-hufpflege-development-postgres-1:/dump.dump

# restore dump
# -U: username
# -c: clean (drop) database objects before recreating them
# -d: database name
# --no-owner: ignore ownership information in the backup
# --role: role name to be used when restoring objects
docker exec -it stinah-hufpflege-development-postgres-1 pg_restore -U abc -c -d abc --no-owner --role=abc /dump.dump

