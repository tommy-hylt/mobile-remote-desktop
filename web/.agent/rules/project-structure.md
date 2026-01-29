---
trigger: always_on
---

# Project Structure & General Rules

(Always On)

## 1. Project Structure

- **Feature-First**: Organize code by feature (e.g., `screen/`, `mouse/`) rather than technical role (no `components/`, `hooks/`, `utils/`, `configs/`, `types/`).
- **Co-location**: Keep all related assets (types, constants, styles, sub-components) within their feature folder.
- **Specificity**: Avoid generic filenames like `types.ts`, `constants.ts`, or `config.ts`. Give files specific, descriptive names (e.g., `ScreenSize.ts`, `MouseConstants.ts`).
- **Filename Consistency**: The filename must exactly match the name of the primary export (e.g., `Screen.tsx` exports `Screen`, `useFetch.ts` exports `useFetch`).

## 2. File Size & Complexity

- **Strict Limits**: Keep files small and focused. Ideally under 60 lines, strictly under 100 lines.
- **Decomposition**: Any component growing beyond 100 lines must be split into smaller sub-components or extracted hooks.

## 3. General Code Quality

- **Zero Tolerance**: The codebase must remain free of linting warnings and errors.
- **No Unused Code**: Delete all unused variables, imports, types, and parameters immediately.
- **No Dead Code**: Do not comment out code. Delete it.
- **Active Cleanup**: Revert debug logging and temporary code immediately after verification.
- **Formatting**: Use **2 spaces** for indentation.
- **Prettier**: Use Prettier to format your code.
