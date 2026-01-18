# Test Plan

## Prerequisites
```bash
npm install
npm run dev
```
Server: http://localhost:6485

## Test Strategy
1. Open Chrome with test.html (has JS event listeners)
2. Use REST API to control mouse/keyboard
3. Use Chrome MCP evaluate_script to verify events were captured

## Test HTML Page (test.html)
The test page logs all input events to `window.events` array:
- mousemove, mousedown, mouseup, click, wheel, keydown

## Test Flow

### Phase 1: Basic API Tests (curl)
```bash
curl http://localhost:6485/screen-size
curl http://localhost:6485/capture/area
curl -X POST http://localhost:6485/capture/area -H "Content-Type: application/json" -d '{"x":0,"y":0,"w":800,"h":600}'
curl http://localhost:6485/mouse/position
curl -X POST http://localhost:6485/clipboard -H "Content-Type: application/json" -d '{"text":"test"}'
curl http://localhost:6485/clipboard
```

### Phase 2: Screen Capture Tests (curl)
```bash
curl http://localhost:6485/capture -o capture.png
curl http://localhost:6485/capture/full -o full.png
curl -w "%{http_code}" http://localhost:6485/capture/new-only -o new.png
```

### Phase 3: Mouse & Keyboard Tests
Setup:
1. MCP: new_page with file:///path/to/test.html
2. MCP: resize_page to known size (800x600)

Test mouse move:
```bash
curl -X POST http://localhost:6485/mouse/move -H "Content-Type: application/json" -d '{"x":400,"y":300}'
```
Verify: MCP evaluate_script `() => window.events.filter(e => e.startsWith('move')).length > 0`

Test mouse click:
```bash
curl -X POST http://localhost:6485/mouse/left/down
curl -X POST http://localhost:6485/mouse/left/up
```
Verify: MCP evaluate_script `() => window.events.some(e => e.startsWith('click'))`

Test keyboard:
```bash
curl -X POST http://localhost:6485/key/a
curl -X POST http://localhost:6485/key/enter
```
Verify: MCP evaluate_script `() => window.events.filter(e => e.startsWith('key')).map(e => e.split(':')[1])`

Test scroll:
```bash
curl -X POST http://localhost:6485/mouse/scroll -H "Content-Type: application/json" -d '{"x":0,"y":3}'
```
Verify: MCP evaluate_script `() => window.events.some(e => e.startsWith('scroll'))`

### Phase 4: Cleanup
```bash
curl -X POST http://localhost:6485/shutdown
```

## Expected Results

| Test | Expected |
|------|----------|
| screen-size | `{"width":N,"height":N}` |
| capture/area GET | `{"x":N,"y":N,"w":N,"h":N}` |
| capture/area POST | `{"success":true,...}` |
| capture | PNG binary |
| capture/full | PNG binary |
| capture/new-only | PNG or 204 |
| mouse/position | `{"x":N,"y":N}` |
| mouse/move | `{"success":true}` + events |
| mouse/btn/down | `{"success":true}` |
| mouse/btn/up | `{"success":true}` + click event |
| mouse/scroll | `{"success":true}` + scroll event |
| key/:key | `{"success":true}` + key event |
| clipboard GET | `{"text":"..."}` |
| clipboard POST | `{"success":true}` |
| shutdown | `{"success":true}` |
