FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

#copy csproj and dependencies
COPY *.csproj ./
RUN dotnet restore

#copy everything and build
COPY . ./
RUN dotnet publish -c Release -o out

#runtime image for the final stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

#expose port
EXPOSE 5000

#start
ENTRYPOINT ["dotnet", "SWEEP.dll"]