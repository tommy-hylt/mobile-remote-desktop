# Code Style Guide

These guidelines reflect the preferred coding style for this project and should be applied to future projects as well.

## 1. Single Responsibility & Naming

- **One File, One Export**: Each file should contain exactly one component, interface, or function.
  - _Exception_: A component's `Props` interface or tightly coupled internal types may reside in the same file.
- **Filename Consistency**: The filename must exactly match the name of the primary export (e.g., `Screen.tsx` exports `Screen`, `useFetch.ts` exports `useFetch`).

## 2. File Size & Complexity

- **Strict Limits**: Keep files small and focused. Ideally under 60 lines, strictly under 100 lines.
- **Decomposition**: Any component growing beyond 100 lines must be split into smaller sub-components or extracted hooks.

## 3. Self-Documenting Code

- **No Comments**: Do not write `//` or `/* */` comments. The code itself must be readable.
- **Refactor over Explain**: If logic requires explanation, refactor it into properly named functions or variables instead of adding comments.
- **Explicit Types**: Use TypeScript interfaces to document data structures rather than comments.

## 4. Inline & Concise Logic

- **Inline Single-Use functions**: Do not name or declare functions that are used only once (e.g., inside an event handler, as component props). Define them inline.
- **Anonymous Functions**: Prefer anonymous arrow functions for callbacks and one-offs.
- **Conciseness**: Use concise syntax (implicit returns) where possible.

## 5. Code Quality & Linting

- **Zero Tolerance**: The codebase must remain free of linting warnings and errors.
- **No Unused Code**: Delete all unused variables, imports, types, and parameters immediately.
- **No Dead Code**: Do not comment out code. Delete it.
- **Formatting**: Use **2 spaces** for indentation.

## 6. Project Structure

- **Feature-First**: Organize code by feature (e.g., `screen/`, `mouse/`) rather than technical role (no `components/`, `hooks/`, `utils/`, `configs/`, `types/`).
- **Co-location**: Keep all related assets (types, constants, styles, sub-components) within their feature folder.
- **Specificity**: Avoid generic filenames like `types.ts`, `constants.ts`, or `config.ts`. Give files specific, descriptive names (e.g., `ScreenSize.ts`, `MouseConstants.ts`).

## 7. CSS & Styling

- **Single File**: Use one plain CSS file per component, named identically (e.g., `Screen.css` for `Screen.tsx`).
- **Root Scoping**: The top-level class must match the file path structure:
  - Top-level: `.App`
  - Feature-level: `.folder-Component` (e.g., `.screen-Screen` for `src/screen/Screen.tsx`)
- **Strict Nesting**: All inner styles must be nested within this root class. Use simple names for children (e.g., `.icon`, `.container`).

## 8. Simplicity

- **Active Cleanup**: Revert debug logging and temporary code immediately after verification.
- **Minimalism**: Avoid over-engineering. Use the simplest native solution (e.g., string interpolation over `URLSearchParams` for simple queries).

## 9. Functional & Concise Logic

- **Immutability**: Avoid `let` and mutation. Use `const` and method chaining.
- **Functional Methods**: Prefer `.map`, `.filter`, `.reduce`, and `.find` over `for` loops.
- **Nullable Types**: Prefer `undefined` over `null` where possible.
- **Coalescing**: Use `??` for default values instead of `||` to respect falsy values like `0`.
