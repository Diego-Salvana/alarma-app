---
name: error-handling-and-ux-feedback
description: Propagate errors from services and surface consistent UX feedback in components without swallowing errors or breaking architecture.
---

# Skill: Error Handling and UX Feedback

## Purpose

Ensure errors are properly surfaced to users without breaking architecture.

## Rules

- Services must propagate errors

- Components must:
  - catch errors
  - display feedback to the user

- Use consistent UI feedback patterns (toasts, messages, etc.)

- Do not swallow errors silently

## Anti-Patterns

- Handling errors inside services with UI logic
- Ignoring failed HTTP requests
