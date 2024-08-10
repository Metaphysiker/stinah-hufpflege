ssh deploy@165.22.16.153 << EOF
    cd /home/deploy/stinah-hufpflege
    git stash
    git pull origin main
    cd /home/deploy/stinah-hufpflege/infrastructure/production
    docker compose down
    docker compose up --build -d
EOF
