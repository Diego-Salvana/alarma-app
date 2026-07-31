---
name: routing-and-navigation
description: Keep feature-based routing in auth.routes.ts and dashboard.routes.ts, with pages inside pages/ and guards for access control only.
---

# Skill: Routing and Navigation

## Purpose

Ensure routing remains organized and feature-based.

## Rules

- Routes must be defined inside:
  - auth.routes.ts
  - dashboard.routes.ts

- Pages must live inside pages/

- Do not define routes inside components

- Guards must only handle access control

## Anti-Patterns

- Mixing routing logic with components
- Adding routes outside feature files
