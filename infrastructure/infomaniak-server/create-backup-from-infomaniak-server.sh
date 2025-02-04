#!/bin/bash

path_to_save_dump="$1"

now=$(date +"%Y-%m-%d_%H_%M_%S")
backup_name="dump_$now.dump"

ssh deploy@84.234.19.192 << EOF
    cd /home/deploy/stinah-pflege
    docker exec stinah-pflege-production-postgres-1 bash -c 'pg_dump -Fc -U stinahpflegeuser stinahpflegedb > db.dump'
    docker cp stinah-pflege-production-postgres-1:/db.dump $backup_name
    mkdir -p /home/deploy/backups/stinah-pflege
    mv $backup_name /home/deploy/backups/stinah-pflege
EOF

scp deploy@84.234.19.192:/home/deploy/backups/stinah-pflege/$backup_name $path_to_save_dump
