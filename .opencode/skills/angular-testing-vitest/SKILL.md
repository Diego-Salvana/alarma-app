---
name: angular-testing-vitest
description: Use when creating, modifying, or reviewing Angular unit tests with Vitest, including .spec.ts files, TestBed, component fixtures, service mocks, and HTTP testing.
---

# Skill: Angular Testing with Vitest

## Purpose

Create Angular unit tests that are clear, isolated, deterministic, maintainable, and focused on relevant observable behavior. Prefer protecting system behavior over maximizing test count or coverage.

## Project Context

- The project uses Angular 19 standalone components, Vitest, `@analogjs/vitest-angular`, and `jsdom`.
- Run the suite with `npm test`; use `npm run test:watch` only when continuous execution is needed.
- Tests live in `src/**/*.spec.ts`.
- Respect the existing feature architecture and the flow: external data -> services -> Signals -> components.
- Use the project's `src/test-setup.ts`; do not replace its Angular/Vitest setup without a concrete need.

## Required Analysis Before Testing

Before adding or changing tests:

1. Review the project structure and the complete unit under test.
2. Identify its dependencies, public behavior, and relevant interfaces or models.
3. Review related services and existing tests to understand real behavior and preserve useful conventions.
4. Determine the smallest necessary test setup and which external dependencies must be mocked.
5. Select only cases that protect behavior that could otherwise regress.

Do not invent requirements or test behavior that does not exist in the implementation.

## Language Convention

All descriptions passed to `describe`, `it`, and `test` must be written in Spanish. Use behavior-focused names, for example:

```ts
describe('Componente Logo', () => {
  it('debería mostrar el logo del tema claro', () => {
    // ...
  });
});
```

Prefer descriptions such as:

- `debería crear el componente`
- `debería mostrar la alarma como activada`
- `debería llamar al servicio al activar la alarma`
- `debería impedir la activación para el usuario demo`
- `debería propagar el error cuando falla la solicitud`

Avoid vague descriptions such as `funciona`, `prueba del método`, or `caso 1`.

## Test Structure

Use an explicit Arrange, Act, Assert flow when it improves readability:

1. Arrange data, mocks, and initial state.
2. Act by calling a method, interacting with the DOM, or subscribing to the exposed API.
3. Assert only the relevant result, state, rendered UI, dependency call, arguments, or error.

Keep each test focused on one main behavior. Prefer small explicit data over large fixtures and avoid helpers unless repetition genuinely harms readability.

## Vitest Rules

Use Vitest APIs exclusively:

- `describe`, `it` or `test`, `expect`, `beforeEach`, `afterEach`
- `vi.fn()` for mocks
- `vi.spyOn()` to observe existing methods when observation is necessary

Never use Jest APIs such as `jest.fn()` or `jest.spyOn()`.

Use clear semantic assertions such as `toBe`, `toEqual`, `toContain`, `toThrow`, `toHaveBeenCalled`, `toHaveBeenCalledTimes`, and `toHaveBeenCalledWith`.

## Angular Components

Use `TestBed` only when Angular dependency injection or component rendering is required. Configure the smallest possible testing module.

- Use `fixture.componentInstance` to set state or invoke public component methods.
- Use `fixture.nativeElement` to assert user-visible DOM output and perform relevant interactions.
- Call `fixture.detectChanges()` only when state must be synchronized with the template.
- For UI behavior, assert the rendered DOM rather than only component internals.
- For behavior triggered by the template, prefer exercising the DOM interaction when it is relevant.

For a component with real logic, do not stop at a creation test. Add the few high-value tests that cover visible state, conditional rendering, interactions, service calls, processed responses, or relevant errors.

## Service Isolation and Mocks

Test services in isolation. Replace independent dependencies through Angular providers or controlled mocks.

```ts
const alarmServiceMock = {
  activar: vi.fn()
};

TestBed.configureTestingModule({
  providers: [{ provide: AlarmService, useValue: alarmServiceMock }]
});
```

- Mock only methods used by the scenario.
- Configure each scenario with `mockReturnValue`, `mockResolvedValue`, or `mockRejectedValue` as appropriate.
- Verify relevant calls and arguments when they represent observable behavior.
- Reset or recreate mutable mocks and state so tests remain independent.
- Do not use real services merely because they are available when they represent a separate unit.

## Services, Signals, and Observables

For services without HTTP, test business rules, transformations, public results, relevant Signal state, dependency interactions, and implemented error behavior.

- Preserve Signals as the source of truth; do not introduce alternate state patterns for tests.
- Test Observables through the API actually exposed by the unit.
- Do not convert an Observable to a Promise unless the production API or project pattern warrants it.
- Wait for asynchronous work to complete before asserting.
- Cover success and error paths only when they are meaningful and implemented.

## HTTP Services

HTTP service tests must not make real backend requests. Use Angular HTTP testing tools to intercept the request.

For relevant successful cases, verify:

- URL and HTTP method
- request body, parameters, or service-owned headers
- returned or mapped response
- Signal state updates when the service owns them

For failures, assert the actual implemented behavior: propagated error, transformed error, alternative state, or specific logic. Do not invent error handling that production code does not implement.

## Scope and Case Selection

Prioritize, in order:

1. Happy path.
2. Relevant error case.
3. Real edge case present in the logic, such as an empty collection, missing value, demo-user restriction, already armed alarm, or absent sensor.

For this alarms application, give priority when present to:

- alarm, central, and sensor state rendering
- arming or disarming interactions and their service arguments
- state received from services
- demo-user action restrictions
- relevant HTTP operation errors

Do not add tests for private implementation, Angular or Vitest internals, external libraries, trivial accessors, simple assignments, snapshots, E2E tools, real HTTP, real sockets, MQTT, databases, or infrastructure unless explicitly requested.

## Production Code and Existing Tests

- Do not alter production behavior only to make a test pass.
- If a test exposes a possible defect, identify the observed behavior and requirements before changing production code. Only fix it when the task includes fixing it.
- Do not remove valid existing tests without a reason.
- Update existing tests only when a legitimate behavior change requires it.
- Preserve test independence: no execution-order assumptions, leaked global state, or mocks configured by another test.

## Completion Criteria

After a testing task:

1. Run the relevant test file or the full suite with `npm test`.
2. Report the unit tested, covered behavior, mocked dependencies, relevant cases, and any notable gaps.
3. State any production issue discovered without silently expanding the task scope.

Use this question before adding each case: `What relevant behavior would no longer be protected if this test failed?`
