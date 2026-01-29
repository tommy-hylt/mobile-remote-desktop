# Throttling & Queueing Plan: "The Manager & The Array"

We will implement a robust throttling system using a discriminated union type for request status, managed by a dedicated logic layer.

## 1. The Data Structure: Discriminated Unions

Split interfaces combined into one type for type safety.

```typescript
interface QueuingItem {
  status: 'queuing';
  area: Rect;
  time: number;
}

interface FiringItem {
  status: 'firing';
  time: number;
  controller: AbortController;
}

interface EndedItem {
  status: 'ended';
  time: number;
  duration: number;
}

type RequestItem = QueuingItem | FiringItem | EndedItem;
```

## 2. Encapsulation: `useCaptureManager.ts`

Logic will be written in a dedicated manager (or hook `useCaptureManager.ts`) to keep the main component clean.

**Responsibilities:**

- Maintain the `items: RequestItem[]` state.
- Maintain the `lastImage: ScreenImage` state alongside the `items`.
- Provide `enqueue(area)`: Adds a `QueuingItem`.
- Tick the heartbeat function until hook is unmounted.

## 3. The Logic: "The Manager Loop"

A `setInterval` (e.g., 200ms) calls `tick()`.

### Step A: Status Updates & Timeout

Iterate current `items`:

- **Firing**:
  - Check if `Now - startTime > 3 * 60 * 1000` (3 mins).
  - If yes: Abort controller, move to `EndedItem` (Error).

### Step B: Throttle Check

- Find `LastFireTime`: Look at the array. Find the `FiringItem` with the latest `startTime` OR `EndedItem` with latest `startTime`.
- Calculate `AvgDuration`: Average `duration` of recent `EndedItem`s.
- **Throttle Rate**: `Interval = Clamp(AvgDuration / 2, 0, 30s)`.

### Step C: Fire Next

- Find the **single** `QueuingItem`. (We enforce 1 max queue item).
- Condition: `Now - LastFireTime > Interval`.
- Action:
  - Transform `QueuingItem` -> `FiringItem`.
  - Set `startTime`.
  - Trigger `fetch()`.

## 4. Interaction Flow

1.  **Usage in `useScreenImages`**:

    ```typescript
    const { enqueue, images } = useScreenThrottle(screenSize);

    // Auto-refresh loop just blindly calls enqueue
    useEffect(() => {
      const t = setInterval(() => enqueue(currentArea), 1000);
      return () => clearInterval(t);
    }, [currentArea]);
    ```

2.  **Queue Management**:
    - `enqueue`: If a `QueuingItem` already exists, **replace it**. This automatically handles the "remove unused queuing items" requirement.

This separation of concerns keeps the UI code (`useScreenImages`) dumb and the throttling logic ("Wise Manager") smart and testable.
