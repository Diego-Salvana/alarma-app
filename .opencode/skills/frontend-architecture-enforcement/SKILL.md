---
name: frontend-architecture-enforcement
description: Enforce the project's feature-based architecture and separation of responsibilities (auth/, dashboard/, shared/) when adding new code.
---

# Skill: Frontend Architecture Enforcement

## Purpose

Ensure all new code strictly follows the project's feature-based architecture and separation of responsibilities.

## Rules

- Code must only be added inside:
  - auth/
  - dashboard/
  - shared/

- Do not create new root-level folders inside app/

- Features must not mix responsibilities

- Use the correct layer:
  - pages → screens/routes
  - components → reusable UI
  - services → business logic, HTTP, WebSocket, state
  - interfaces → types

- Do not move logic between features without clear justification

- Always follow the Component → Service → State flow
