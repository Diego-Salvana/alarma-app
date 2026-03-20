# Skill: WebSocket Integration

## Purpose

Ensure correct handling of real-time updates using Socket.IO.

## Rules

- WebSocket logic must exist only inside services

- Components must never interact with sockets directly

- WebSocket events must:
  - update Signals
  - not trigger UI side effects directly

- WebSocket is read-only from frontend

- All real-time updates must flow:
  WebSocket → RxJS → Service → Signals → UI

## Anti-Patterns

- Using sockets inside components
- Triggering navigation from socket events
- Mixing socket logic with UI logic
