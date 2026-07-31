## Project Overview

This project is the frontend application for a smart home alarm system, built with **Angular** and deployed as both a **web application** and a **mobile app using Capacitor**.

The application provides users with a centralized dashboard to monitor, control, and configure their alarm systems in real time.

### System Entities

The system is designed around the following main entities:

- **User**: the authenticated user who owns and manages alarm systems.
- **House**: represents a physical location with an installed alarm system.
- **Central**: the alarm control unit associated with a house.
- **Sensors**: security devices connected to the central that detect events and trigger alarms.

Each user can manage multiple houses, each containing one central unit and multiple sensors.

### Core Features

The frontend allows users to:

- Authenticate (login and session management)
- Manage their profile information and credentials
- View and manage houses (name, alarm code)
- View and rename sensors
- Control the alarm (arm / disarm with optional sensor exclusion)
- View alarm activity history (global and per sensor)
- Receive real-time updates when alarm events occur

### Communication Model

The frontend communicates exclusively with the backend:

- **HTTP REST API** → for all commands and data operations  
- **WebSockets (Socket.IO)** → for real-time updates  

> The frontend **never communicates directly with MQTT or physical devices**.

## Tech Stack

The frontend is implemented using the following technologies:

### Framework

- Angular 19 using standalone APIs

### Language

- TypeScript

### State Management

- Angular Signals for internal reactive state  
- RxJS for handling asynchronous data and external streams (HTTP, WebSocket)

### UI & Styling

- PrimeNG for UI components  
- PrimeIcons for iconography  
- TailwindCSS for styling and layout  

### Mobile Support

- Capacitor for building Android mobile applications  

### Real-Time Communication

- Socket.IO Client for receiving real-time updates from backend  

### Utilities

- Lodash for utility functions  

### Tooling

- Angular CLI  
- ESLint for linting  
- Prettier for code formatting  

## Architecture

The frontend follows a feature-based architecture combined with a clear separation of responsibilities between UI, state management and data access.

### Project Structure

The main source code is located inside the `src/app` directory.

```txt
src/
  app/
    auth/
      guards/
      interfaces/
      pages/
      services/
      utils/
      auth.component.ts
      auth.routes.ts

    dashboard/
      components/
      guards/
      interceptors/
      interfaces/
      pages/
      services/
      dashboard.component.ts
      dashboard.routes.ts

    shared/

    app.component.ts
    app.routes.ts
    app.config.ts
    env.ts

  assets/
  scss/
  themes/
  styles.scss
  main.ts
```

### Feature-Based Organization

The application is divided into feature modules (folders):

### Features

- **Auth** → authentication flows
- **Dashboard** → main app (alarm, houses, sensors, profile, history)

Each feature contains:

- pages → represent full screens or routes
- components (dashboard only) → reusable UI pieces within pages
- services → HTTP communication, WebSocket handling, state updates
- guards → route guards
- interfaces → type definitions

### Routing

Routing is defined per feature:

- `auth.routes.ts`
- `dashboard.routes.ts`

And composed in:

- `app.routes.ts`

### Global Configuration

- `app.config.ts` → application-wide providers and configuration  
- `env.ts` → environment configuration  

### Styling

Global styles are defined in `styles.scss`.

Additional styling layers:

- `scss/`
- `themes/`

TailwindCSS is used for layout and utility styling.

## Code Conventions

The frontend follows a set of conventions to ensure consistency, maintainability and a clear separation of responsibilities.

### Responsibilities

#### Components

- UI + interaction + UI logic
- error display

#### Services

- business logic
- HTTP / WebSocket
- state updates

### State Management

- Signals = source of truth
- RxJS = external data → must update Signals

❌ Do not store shared state in components  
❌ Do not replace Signals with Observables

### HTTP Communication

- All HTTP calls must be performed inside services using HttpClient
- Components must never call HTTP directly
- Responses should be processed before being used by the UI

### Error Handling

- Handled in components (UI feedback)
- Services propagate errors

### Forms

- Use Reactive Forms
- Template-driven only for simple inputs

### WebSocket Communication

WebSocket communication is handled via Socket.IO Client.

- Only handled in services
- Update Signals  

❌ No socket usage in components

### Reactive Flow

External Data → RxJS → Services → Signals → Components

### Naming Conventions

- Components: `SomethingComponent`
- Services: `SomethingService`
- Interfaces: descriptive and domain-oriented names

### Standalone Components

- All components: `standalone: true`
- No NgModules

### Code Style

- Prefer clean and readable code over clever solutions
- Keep functions small and focused
- Avoid unnecessary abstractions
- Follow existing project patterns before introducing new ones

## Agent Guidelines

This section defines how AI agents should interact with and modify the frontend codebase.

### Architecture

- Use only auth/, dashboard/, shared/
- Do not create new root folders

### Component-Service Pattern

All new functionality must respect the separation:

Component → Service → Backend → Service → State → Component

- Business logic → services
- No HTTP or business logic in components

### Use Existing Services First

- search for an existing service in the feature
- extend it if the functionality is related
- avoid duplicating logic

### State Management Rules

- Must live in services (Signals)
- Reuse existing state services

- No duplicated state
- No alternative state patterns

### WebSocket Rules

- Only in services
- Read-only from frontend

### HTTP and Data Handling

- Use existing contracts
- Do not modify response structure

### Routing and Pages

- Pages inside `pages/`
- Routes in feature `*.routes.ts`

### Forms and UI Logic

- Forms must use Reactive Forms
- UI logic can remain in components

- Do not move form logic to services
- Do not introduce complex template logic

### Do Not Introduce Unnecessary Abstractions

Agents should avoid:

- unnecessary design patterns
- generic utility layers without clear need
- over-engineering simple features

### Preserve Existing Behavior

Agents must not:

- break existing functionality
- modify working flows without reason
- refactor large areas unless explicitly requested

### When Adding New Features

Agents should:

- identify the correct feature (`auth` or `dashboard`)
- add UI in `pages/` or `components/`
- extend or create a service if needed
- connect state via Signals
- integrate with existing routing

### Development Workflow

When implementing a feature:

1. Identify the feature (auth / dashboard)
2. Check existing services
3. Extend or create service
4. Connect state via Signals
5. Create/update component
6. Add route if needed

### Important Principle

The frontend is a reactive, service-driven architecture.

- Services control data and state
- Components reflect state and handle UI
- Signals are the single source of truth

Agents must always preserve this model.

## Skills

This project uses a set of specialized skills located in the `.opencode/skills/` directory.

Agents must consult and follow these skills when implementing functionality, especially for:

- State management
- HTTP communication
- WebSocket handling
- Component design
- Forms and routing
- Error handling
