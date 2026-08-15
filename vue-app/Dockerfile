FROM node:21-alpine as development-stage

WORKDIR /app

COPY package.json .

COPY package-lock.json .

RUN npm install

COPY . .

ARG VITE_API_BASE_URL

ENV VITE_API_BASE_URL $VITE_API_BASE_URL

# Ensure `curl` is available for container healthchecks.
RUN apk add --no-cache curl

EXPOSE 8080

RUN npm run build

CMD ["npm", "run", "dev", "--", "--port",  "8080", "--host", "0.0.0.0"]

FROM nginx as production-stage

RUN mkdir /app

COPY --from=development-stage /app/dist /app

COPY nginx.conf /etc/nginx/nginx.conf
