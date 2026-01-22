---
description: Enforce code style guidelines before completing a task or notifying the user.
---

This workflow must be run before `notify_user` or marking a task as complete.

1. **Verify Build**: Run `npm run build` to ensure no lint errors or type failures.
2. **Auto-Correct**: If issues are found, fix them immediately without asking.
