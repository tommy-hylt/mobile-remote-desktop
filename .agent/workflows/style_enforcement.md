---
description: Enforce code style guidelines before completing a task or notifying the user.
---

This workflow must be run before `notify_user` or marking a task as complete.

1. **Read Guidelines**: Read `.agent/rules.md` to refresh memory on current rules.
2. **Scan Active Files**: Check all files modified in the current session.
3. **Ensure Following Guidelines**: Rewrite code which does not follow the guidelines.
4. **Verify Build**: Run `npm run build` to ensure no lint errors or type failures.
5. **Auto-Correct**: If issues are found, fix them immediately without asking.
