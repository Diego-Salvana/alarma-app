# Skill: State Management with Signals

## Purpose

Ensure consistent and correct usage of Angular Signals as the single source of truth.

## Rules

- All shared state must live inside services

- Signals must be the single source of truth

- RxJS must only be used for:
  - HTTP requests
  - WebSocket streams
  - async flows

- RxJS results must update Signals

- Do not expose Observables as application state

- State must not be duplicated across services

- State updates must be done immutably

- Never mutate arrays or objects directly

## Anti-Patterns

- Storing state in components
- Using BehaviorSubject as main state
- Mixing Signals and Observables as state sources
