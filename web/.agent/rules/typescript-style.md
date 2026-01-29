---
trigger: model_decision
description: Guidence applies to .ts, .tsx files
---

# TypeScript Style Guide

## 1. Single Responsibility

- **One File, One Export**: Each file should contain exactly one component, interface, or function.
  - _Exception_: A component's `Props` interface or tightly coupled internal types may reside in the same file.

## 2. Self-Documenting Code

- **No Comments**: Do not write `//` or `/* */` comments. The code itself must be readable.
- **Refactor over Explain**: If logic requires explanation, refactor it into properly named functions or variables instead of adding comments.
- **Explicit Types**: Use TypeScript interfaces to document data structures rather than comments.

## 3. Concise Logic

- **Immutability**: Avoid `let` and mutation. Use `const` and method chaining.
- **Functional Methods**: Prefer `.map`, `.filter`, `.reduce`, and `.find` over `for` loops.
- **Nullable Types**: Prefer `undefined` over `null` where possible.
- **Coalescing**: Use `??` for default values instead of `||` to respect falsy values like `0`.
- **Inline Single-Use functions**: Do not name or declare functions that are used only once (e.g., inside an event handler, as component props). Define them inline.
- **Anonymous Functions**: Prefer anonymous arrow functions for callbacks and one-offs.
- **Conciseness**: Use concise syntax (implicit returns) where possible.
- **Minimalism**: Avoid over-engineering. Use the simplest native solution.
