# Code Style Guidelines

These guidelines reflect the preferred coding style for this project and should be applied to future projects as well.

## 1. Comments
*   **No Comments Allowed**: Do not write comments in the code (no `//` or `/* */`).
*   **Self-Documenting Code**: If you feel the need to explain a block of code with a comment, you must instead refactor the code to make it self-explanatory.
    *   **Descriptive Naming**: Use clear, descriptive names for variables, functions, and classes that explain *what* they are and *why* they exist.
    *   **Extraction**: Extract complex logic into small, reasonably named helper functions.
    *   **Types**: Use explicit TypeScript types and interfaces to clarify data structures instead of documenting them.

## 2. Code Quality & Linting
*   **Zero Warnings**: The codebase must remain free of linting warnings and errors.
*   **No Unused Code**: Strictly remove all unused variables, imports, types, and parameters.
*   **Dead Code**: Do not comment out code for later use; delete it.

## 3. Readability
*   Prioritize clarity over brevity.
*   Keep functions small and focused on a single responsibility.

## 4. File & Folder Structure
*   **Feature-Based Organization**: Group code by feature (e.g., `screen`, `mouse`) rather than technical role. Avoid generic top-level folders like `core`, `utils`, or `components`.
*   **No "Core" Modules**: specific types, constants, and logic should reside in their respective feature folders.
*   **Co-location**: Keep related types (`Point.ts`), constants, and sub-components within the feature folder they belong to.

## 5. Naming & Files
*   **Meaningful Filenames**: Avoid generic filenames like `constants.ts` or `config.ts`. Use specific names that describe the content (e.g., `server.ts` for server configuration).
*   **Function-File Match**: The name of the main exported function should match the filename (e.g., `useDebounce` inside `useDebounce.ts`).
