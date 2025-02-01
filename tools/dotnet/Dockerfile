FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env

WORKDIR /app

RUN dotnet tool install --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"

COPY . /app
