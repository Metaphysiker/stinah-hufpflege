ssh deploy@165.22.16.153 << EOF
    cd /home/deploy/stinah-pflege/stinah-hufpflege
    git stash
    git pull
    cd /home/deploy/stinah-pflege/stinah-hufpflege/infrastructure/production2
    docker compose down
    docker compose up --build -d
EOF
