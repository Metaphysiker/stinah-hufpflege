FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env

WORKDIR /App

COPY . ./

RUN dotnet restore

# Allow selecting build configuration via build-arg (default: Release).
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish -c ${BUILD_CONFIGURATION} -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

WORKDIR /App

# Ensure lightweight tools used by healthchecks are available in the runtime image.
RUN apt-get update \
	&& apt-get install -y curl \
	&& rm -rf /var/lib/apt/lists/*

# No SDK commands in the runtime image. Tools and SDK operations are performed
# in the build stage. Copy published output from the build stage.
COPY --from=build-env /App .

EXPOSE 8080
ENTRYPOINT [ "dotnet", "out/WebApi.dll" ]
