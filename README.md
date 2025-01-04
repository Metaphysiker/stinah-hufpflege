# stinah-hufpflege

ssh deploy@165.22.16.153

cd stinah-hufpflege

git pull origin main

in production folder:
docker compose down
docker compose up --build

### Add packages to vue-app

tpms-frontend is made with vue.js. Vue.js uses node and npm.

If you want to add a (node-)package, do this:

    docker compose run npm sh
    cd vue-app
    npm install name_of_package --save

This way, you don't have to install node and npm on your machine and you always have the correct version.
