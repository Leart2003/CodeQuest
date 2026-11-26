# CodeQuest

CodeQuest is a full-stack learning platform for practicing programming concepts through guided worlds and levels. Players progress through unlocked challenges, earn XP, review completed questions, and compete on a leaderboard. Administrators can create and manage worlds and levels.

## Features

- Cookie-based registration and login with ASP.NET Identity
- Sequential world and level progression
- Multiple-choice, fill-in-the-blank, spot-the-bug, and ordered-line challenges
- XP rewards, attempt tracking, and a leaderboard
- Role-protected administration pages for worlds and levels
- EF Core persistence with SQL Server

## Tech stack

- **Backend:** ASP.NET Core 10 Web API, C#
- **Application:** DTOs, validators, and game/admin service interfaces
- **Persistence:** Entity Framework Core 10 with SQL Server and ASP.NET Identity
- **Frontend:** React 19, React Router 7, Vite 8
- **API documentation:** Swagger / OpenAPI

## Repository structure

```text
CodeQuest.Domain/          Domain entities and challenge enums
CodeQuest.Application/     DTOs, service interfaces, and validators
CodeQuest.Infrastructure/  EF Core context, migrations, Identity, seeders, and services
CodeQuest/                 ASP.NET Core API entry point and controllers
codequest-client/          React client built with Vite
CodeQuest.slnx             Solution file for the four C# projects
```

The API follows a layered structure:

- `Program.cs` configures EF Core, ASP.NET Identity, cookies, CORS, Swagger, and dependency injection.
- `Controllers/` exposes authentication, world, level, leaderboard, and admin endpoints.
- `IGameService` and `IAdminService` define application operations implemented by the infrastructure services.
- `AppDbContext` persists worlds, levels, options, answers, user progress, and Identity users.
- `src/App.jsx` defines protected player and admin routes for the React application.

## Prerequisites

- .NET 10 SDK
- SQL Server or SQL Server Express with the LocalDB feature
- Node.js and npm

The default API configuration uses SQL Server LocalDB:

```json
"ConnectionStrings": {
  "DefaultConnection": "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=CodeQuest;Integrated Security=True;"
}
```

Update `CodeQuest/appsettings.json` or provide an override if your database is hosted elsewhere.

## Run the API

From the repository root:

```bash
dotnet restore CodeQuest.slnx
dotnet run --project CodeQuest/CodeQuest.API.csproj
```

On the first run, `DbSeeder` and `IdentitySeeder` create initial game data and the default administrator account. The defaults are configured in `CodeQuest/appsettings.json`:

```text
Username: admin
Password: Admin123
```

For local development, Swagger and OpenAPI are enabled when the ASP.NET environment is `Development`.

## Run the client

```bash
cd codequest-client
npm install
npm run dev
```

Vite serves the React application locally. The client sends cookie-authenticated requests to the API base configured through `VITE_API_URL`.

For a production build:

```bash
npm run build
npm run preview
```

Set `VITE_API_URL` when the frontend and API are deployed on separate origins:

```dotenv
VITE_API_URL=https://your-api.example.com
```

In the current production environment file, `VITE_API_URL` is empty because the client is configured for same-origin requests.

## API overview

| Area | Main routes |
| --- | --- |
| Authentication | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` |
| Worlds | `GET /api/worlds` |
| Levels | `GET /api/levels/{id}`, `POST /api/levels/{id}/submit` |
| Leaderboard | `GET /api/leaderboard` |
| Administration | `/api/admin/*` endpoints for managing worlds and levels |

## Challenge types

- **Multiple choice:** select one of the provided options.
- **Fill in the blank:** submit text that matches an accepted answer.
- **Spot the bug:** identify the incorrect or buggy code option.
- **Order the lines:** arrange code lines into the required order.

## Development checks

```bash
# Restore and build the full .NET solution
dotnet build CodeQuest.slnx

# Check the React client
cd codequest-client
npm run lint
npm run build
```
