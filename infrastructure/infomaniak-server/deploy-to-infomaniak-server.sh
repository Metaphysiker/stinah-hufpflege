#!/bin/bash
scp update_version.sh deploy@84.234.19.192:/home/deploy/stinah-pflege

gitsha=$(git log -1 --format="%H")
ssh deploy@84.234.19.192 << EOF
    cd /home/deploy/stinah-pflege
    ./update_version.sh $gitsha
EOF

docker compose --file docker-compose.build.yml build

docker save stinah-pflege-production-webapi | bzip2 | pv | ssh deploy@84.234.19.192 docker load

docker save stinah-pflege-production-vue | bzip2 | pv | ssh deploy@84.234.19.192 docker load

scp docker-compose.remote.yml deploy@84.234.19.192:/home/deploy/stinah-pflege

scp .env deploy@84.234.19.192:/home/deploy/stinah-pflege

ssh deploy@84.234.19.192 << EOF
    cd /home/deploy/stinah-pflege
    docker compose --file docker-compose.remote.yml down
    docker compose --file docker-compose.remote.yml up -d
    docker system prune -f
EOF
