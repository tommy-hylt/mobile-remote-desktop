# Code Style Guide

These guidelines reflect the preferred coding style for this project and should be applied to future projects as well.

## 1. One File for One Component/Function

- **Single Responsibility**: Each file should contain only one component or one interface. Multiple interfaces are allowed if they are to combine into one type. A component's `Props` are also allowed to be in the same file as the component.
- **File Name**: File name should be exactly the same as the root component or root interface.
- **File Size**: Keep file sizes small. Ideally under 60 lines, strictly under 100 lines.
- **Split Large Files**: Components growing beyond 100 lines must be split into smaller sub-components or hooks.

## 2. Comments

- **No Comments Allowed**: Do not write comments in the code (no `//` or `/* */`).
- **Self-Documenting Code**: If you feel the need to explain a block of code with a comment, you must instead refactor the code to make it self-explanatory.
  - **Descriptive Naming**: Use clear, descriptive names for variables, functions, and classes that explain _what_ they are and _why_ they exist.
  - **Extraction**: Extract complex logic into small, reasonably named helper functions.
  - **Types**: Use explicit TypeScript types and interfaces to clarify data structures instead of documenting them.

## 3. Inline Logic & Anonymous Functions

- **Inline Logic**: For functions only used once in one place, do not name or create them. Write the code directly in the place of use (e.g., inside the event handler prop).
- **Avoid Named One-Off Functions**: Strictly avoid naming functions that are only used once.
- **Conciseness**: Prefer arrow functions and concise syntax.

## 4. Code Quality & Linting

- **Zero Warnings**: The codebase must remain free of linting warnings and errors.
- **No Unused Code**: Strictly remove all unused variables, imports, types, and parameters.
- **Dead Code**: Do not comment out code for later use; delete it.

## 5. File & Folder Structure

- **Feature-Based Organization**: Group code by feature (e.g., `screen`, `mouse`) rather than technical role. Avoid generic top-level folders like `core`, `utils`, or `components`.
- **No "Core" Modules**: specific types, constants, and logic should reside in their respective feature folders.
- **Co-location**: Keep related types (`Point.ts`), constants, and sub-components within the feature folder they belong to.

## 6. Naming & Files

- **Meaningful Filenames**: Avoid generic filenames like `constants.ts`, `config.ts`, or `types.ts`. Use specific names that describe the content (e.g., `server.ts` for server configuration, `Rect.ts` for Rect interface).
- **Function-File Match**: The name of the main exported function or type should match the filename (e.g., `useDebounce` inside `useDebounce.ts`, `ViewportState` inside `ViewportState.ts`).
- **Separate Type Files**: Define interfaces and types in their own separate files. Do not bundle them.
- **Co-location**: Place type files in the directory where they are primarily used.

## 7. Formatting & Readability

- **Indentation**: Use **2 spaces** for indentation.
- Prioritize clarity over brevity.
- Keep functions small and focused on a single responsibility.

## 8. CSS Files

- **Plain CSS**: Plain CSS file of the same name as the component (e.g., `Screen.css` for `Screen.tsx`).
- **Native Nesting**: Use native CSS nesting to scope styles.
- **Root Class**: The root element of a component must have a class name that strictly follows the file path convention:
  - Top-level: `App` for `App.tsx`.
  - Nested: `[folder]-[Component]` (e.g., `screen-Screen` for `src/screen/Screen.tsx`).
- **Inner Classes**: Use simple, descriptive names for inner elements (e.g., `.image`), strictly nested within the root class.

## 9. Simplicity & Cleanup

- **Active Cleanup**: Always revert debug logging, temporary test code, and unused artifacts immediately after verifying a fix. The codebase should remain clean at all times.
- **Avoid Over-Engineering**: Do not use complex APIs (like `URLSearchParams`) when a simple string construction sufficies.
- **Minimal Abstraction**: Use the simplest possible solution that solves the problem.

## 10. Concise Logic

- **Immutability**: Avoid `let` and mutation. Use `const` chains to transform data step-by-step (e.g., `filter` -> `sort` -> `slice`).
- **Functional Iteration**: Prefer `.map`, `.filter`, and other array methods over traditional `for` loops.
- **Nullish Coalescing**: Prefer `??` over `||` for default values to strictly handle `null`/`undefined` without suppressing falsy values (e.g. `0`, `""`).
