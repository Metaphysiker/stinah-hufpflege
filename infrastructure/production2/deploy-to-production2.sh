ssh deploy@165.22.16.153 << EOF
    cd /home/deploy/stinah-pflege
    git stash
    git pull origin main
    cd /home/deploy/stinah-pflege/infrastructure/production2
    docker compose down
    docker compose up --build -d
EOF
