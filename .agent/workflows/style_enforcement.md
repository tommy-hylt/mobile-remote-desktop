---
description: Enforce code style guidelines before completing a task or notifying the user.
---

This workflow must be run before `notify_user`.

1. **Read Style Rules**: Read `.agent/rules` to refresh memory on rules.
2. **Scan Active Files**: Check all files modified in the current session.
3. **Ensure Following Guidelines**: Rewrite code which does not follow the guidelines.
