# Git Repository Merge Plan

## Overview

Merge two separate Git repositories into this monorepo while preserving their commit history:

| Source Repository | Target Folder |
|-------------------|---------------|
| `../mobile-remote-desktop-server` | `./server` |
| `../mobile-remote-desktop-web2` | `./web` |

## Current State

- **This repo** (`./mobile-remote-desktop`): Empty repo with no commits
- **Server repo**: Python/FastAPI backend (latest commit: `7c400a0`)
- **Web repo**: TypeScript/Vite frontend (latest commit: `53fb96a`)

## Strategy

Using `git subtree add` to merge each repository while preserving full commit history. This approach:
- Preserves all commit history from both repos
- Places files directly in the target subdirectories
- Creates a clean monorepo structure

---

## Commands to Execute

### Step 1: Create initial commit in this repo (required for subtree)

```cmd
git commit --allow-empty -m "Initial commit: prepare monorepo"
```

### Step 2: Add server repository as subtree

```cmd
git remote add server-origin ../mobile-remote-desktop-server
git fetch server-origin
git subtree add --prefix=server server-origin/main
```

### Step 3: Add web repository as subtree

```cmd
git remote add web-origin ../mobile-remote-desktop-web2
git fetch web-origin
git subtree add --prefix=web web-origin/main
```

### Step 4: Clean up remotes (optional)

```cmd
git remote remove server-origin
git remote remove web-origin
```

### Step 5: Verify the merge

```cmd
git log --oneline --graph
dir server
dir web
```

---

## Expected Result

After execution, the directory structure will be:

```
mobile-remote-desktop/
├── server/
│   ├── .claude/
│   ├── .gitignore
│   ├── CLAUDE.md
│   ├── core/
│   ├── main.py
│   ├── requirements.txt
│   ├── routes/
│   ├── start.cmd
│   ├── test.html
│   ├── TEST.md
│   └── WS.md
├── web/
│   ├── .agent/
│   ├── .gitignore
│   ├── .prettierrc
│   ├── .vscode/
│   ├── DESIGN.md
│   ├── eslint.config.js
│   ├── GEMINI.md
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── public/
│   ├── README.md
│   ├── src/
│   ├── start.cmd
│   ├── THROTTLING_DISCUSSION.md
│   ├── tsconfig*.json
│   └── vite.config.ts
├── .git/
└── MERGE.md
```

## Notes

- The `node_modules` and `dist` folders from web repo should be excluded by `.gitignore`
- Both repositories' `.gitignore` files will be preserved in their respective folders
- Commit history from both repos will be preserved and viewable via `git log`
