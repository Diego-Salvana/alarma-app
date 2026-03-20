# Skill: HTTP and Data Handling

## Purpose

Ensure all API communication is consistent, isolated, and properly integrated into the state.

## Rules

- All HTTP calls must be made inside services using HttpClient

- Components must never call HTTP directly

- API responses must be mapped before being stored in state

- Do not expose raw backend responses to components

- Services must handle:
  - data transformation
  - state updates

- Components only consume processed state

## Anti-Patterns

- Calling HTTP inside components
- Using raw API responses in templates
- Duplicating API calls across services
