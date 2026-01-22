---
trigger: model_decision
description: Guidence applies to .css files
---

# CSS & Styling Rules

## 1. File Structure

- **Single File**: Use one plain CSS file per component, named identically (e.g., `Screen.css` for `Screen.tsx`).

## 2. Scoping & Naming

- **Root Scoping**: The top-level class must match the file path structure:
  - Top-level: `.App`
  - Feature-level: `.folder-Component` (e.g., `.screen-Screen` for `src/screen/Screen.tsx`)
- **Strict Nesting**: All inner styles must be nested within this root class. Use simple names for children (e.g., `.icon`, `.container`).
