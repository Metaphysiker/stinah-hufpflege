#!/bin/bash

path_to_save_dump="$1"

now=$(date +"%Y-%m-%d_%H_%M_%S")
backup_name="dump_$now.sql"


ssh deploy@84.234.19.192 << EOF
    cd /home/deploy/stinah-pflege
    docker exec -t stinah-pflege-production-postgres-1 pg_dumpall -c -U stinahpflegeuser > $backup_name
    mkdir -p /home/deploy/backups
    mv $backup_name /home/deploy/backups/stinah-pflege
EOF

scp deploy@84.234.19.192:/home/deploy/backups/stinah-pflege/$backup_name $1 $path_to_save_dump
