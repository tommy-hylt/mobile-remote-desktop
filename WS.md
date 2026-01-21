# WebSocket Protocol Design

## Overview

Single WebSocket connection per client. Supports all existing HTTP endpoints via message-based RPC.

## Connection

```
ws://localhost:6485/ws
```

## Message Format

### Client Request

```json
{
  "id": "uuid-v4",
  "method": "GET /screen-size",
  "params": {}
}
```

| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID for request-response correlation |
| method | string | HTTP verb + path (e.g., `GET /capture`, `POST /mouse/move`) |
| params | object | Parameters (query params, body, headers combined) |

### Server Response

```json
{
  "id": "uuid-v4",
  "status": 200,
  "data": { "width": 1920, "height": 1080 }
}
```

| Field | Type | Description |
|-------|------|-------------|
| id | string | Matches request id |
| status | number | HTTP-like status code |
| data | any | Response payload |

### Error Response

```json
{
  "id": "uuid-v4",
  "status": 400,
  "error": "Invalid parameters"
}
```

## Methods

| Method | Params | Response |
|--------|--------|----------|
| `GET /screen-size` | none | `{ width, height }` |
| `GET /capture` | `{ area?, quality?, last_hash? }` | Special (see below) |
| `GET /mouse/position` | none | `{ x, y }` |
| `POST /mouse/move` | `{ x, y }` | `{ success, x, y }` |
| `POST /mouse/{button}/{action}` | none | `{ success, button, action }` |
| `POST /mouse/scroll` | `{ x, y }` | `{ success, x, y }` |
| `POST /key/{key}` | none | `{ success, key }` |
| `GET /clipboard` | none | `{ text }` |
| `POST /clipboard` | `{ text }` | `{ success }` |
| `POST /shutdown` | none | `{ success, message }` |

## Special Case: `GET /capture`

### Case 1: Hash Match (204 equivalent)

Client sends:
```json
{
  "id": "abc-123",
  "method": "GET /capture",
  "params": { "last_hash": "404e9ce71c13ae24157d0d9a853744cc", "quality": 50 }
}
```

Server responds (single message):
```json
{
  "id": "abc-123",
  "status": 204,
  "data": { "next_hash": "404e9ce71c13ae24157d0d9a853744cc" }
}
```

### Case 2: New Image (200 equivalent)

Server responds with **two consecutive messages**:

**Message 1 (JSON metadata):**
```json
{
  "id": "abc-123",
  "status": 200,
  "data": { "next_hash": "5f2b9c...", "date": "Tue, 21 Jan 2026 12:34:56 GMT" }
}
```

**Message 2 (Binary JPEG):**
```
[raw JPEG bytes]
```

Client must expect binary message immediately after 200 capture response.

## Design Decisions

- **Binary correlation**: Trust TCP ordering. Binary always follows its metadata message.
- **No push**: Request-response only. Client controls capture timing.
- **Concurrent requests**: Allowed. Use request ID for correlation.
