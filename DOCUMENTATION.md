# Feature Documentation

## Approach Summary

The challenge required improving an Angular application that displays users from the randomuser.me API. The main goals were: render 5000 users performantly, group them by criteria using a Web Worker, add expand-on-click with animation, and polish the UI.

### Architecture Decisions

#### 1. Virtual Scrolling with CDK

**Problem:** Rendering 5000 DOM nodes causes significant layout thrashing, high memory usage, and sluggish scrolling.

**Solution:** Angular CDK `cdk-virtual-scroll-viewport` with a fixed item size strategy (`itemSize="60"`). Only visible rows are rendered in the DOM (~15-20 at a time), keeping memory and CPU usage constant regardless of list size.

**Trade-off:** Fixed item size means the expanded detail row doesn't get extra space inside virtual scroll. The expand/collapse is handled within the item's own DOM, which works but limits animation options. This was an acceptable trade-off for the performance gain.

#### 2. Web Worker for Grouping

**Problem:** Grouping 5000+ users (sorting, bucketing into maps, building result arrays) can block the main thread, causing UI jank during criterion switches.

**Solution:** A dedicated Web Worker (`src/app/workers/grouping.worker.ts`) receives the user array and grouping criterion, performs all computation off the main thread, and posts back the grouped result.

**Why not search in the Worker?** The search filter (`string.startsWith()` on 5000 items) takes <1ms — far less than the structured cloning cost of serializing the user array to/from the Worker. Search stays on the main thread; only the heavier grouping is offloaded.

#### 3. Flattened Row Model

The virtual scroll needs a single flat array. The `flattenGroups()` function converts grouped data into a discriminated union of row types:

```typescript
type ListRow =
  | { type: 'header'; name: string; count: number; expanded: boolean }
  | { type: 'column-header' }
  | { type: 'user'; user: User };
```

This allows the template to render group headers, column headers, and user items within a single `*cdkVirtualFor` loop. Expanding/collapsing a group simply regenerates the flat array — collapsed groups only contribute a header row.

#### 4. Standalone Components & OnPush

All components use Angular's standalone architecture (no NgModules) and `ChangeDetectionStrategy.OnPush`. Combined with signal-based inputs, this ensures Angular only checks components when their inputs actually change, minimizing change detection cycles when scrolling through thousands of items.

### Features Implemented

#### Grouping by Criteria
- **Nationality:** Groups by country code, displays country flag emoji and full name
- **Alphabetical:** Groups by first letter of last name (A-Z)
- **Age:** Groups by age ranges (18-25, 26-35, 36-45, 46-55, 56+)

Criterion buttons in the header allow switching. Each switch triggers a re-grouping via the Web Worker.

#### Expandable User Details
Clicking a user row toggles an inline detail panel showing: username, age, gender, city, country, phone, email, and registration date.

#### Client-Side Search (Bonus)
A search input filters users by last name prefix. Filtering happens on the main thread (instant for 5000 items), then the filtered subset is sent to the Web Worker for re-grouping. This keeps the architecture clean — the Worker stays stateless.

#### Pagination / Load More (Bonus)
A "Load more users" button fetches the next page of 5000 users from the API and appends them to the existing dataset. The combined set is re-grouped, so groups grow naturally (e.g., the "Germany" group gets more users). Each page is cached via `shareReplay(1)` to avoid duplicate API calls.

#### Responsive Design
Uses the EASE design system's breakpoint mixins (`media-breakpoint-down`). Below the `m` breakpoint (810px):
- Header stacks vertically (criterion buttons and search below the logo)
- Only Name and Email columns are shown in the list
- Phone, Email, and Registered move into the expandable detail panel
- Detail grid switches from 3-column to single-column row layout
- Container widths and paddings adjust for smaller screens

#### UI/UX Polish
- Skeleton loading state with shimmer animation while data loads
- EASE design system integration (colors, typography, spacing, shadows)
- Group headers with country flags (nationality criterion)
- Column headers for the list
- Hover states on rows and group headers
- Text overflow ellipsis for long values

### Trade-offs & Limitations

#### Virtual Scroll + Fixed Item Size
CDK virtual scroll requires a fixed `itemSize` to calculate scroll position. This means every row (group header, column header, user item) occupies the same 60px height in the scroll container. When a user expands their detail panel, the content overflows beyond the 60px slot. This works visually but means the scroll thumb position isn't perfectly accurate, and very long detail panels can overlap with the next row's click target. An alternative would be `autosize` strategy, but it has significant performance costs with 5000+ items and is still experimental in CDK.

#### Web Worker Serialization Overhead
Every time we regroup (criterion switch, search, load more), the entire user array is serialized via structured clone to the Worker and the result is cloned back. For 5000 users this is fast (~10-20ms), but at 20,000+ users the serialization cost becomes noticeable. A potential optimization would be using `SharedArrayBuffer` or keeping a persistent copy in the Worker, but this adds complexity and state synchronization concerns that aren't justified at the current scale.

#### Flattening on Every Group Toggle
Expanding or collapsing a group calls `flattenGroups()` which rebuilds the entire flat array. For a few dozen groups this is negligible, but it means Angular's change detection sees a new array reference and the virtual scroll re-evaluates all visible items. An incremental approach (splicing rows in/out) would be more efficient but harder to maintain and debug.

#### Search Debounce
The search input is debounced at 200ms via an RxJS `Subject` with `debounceTime`. This prevents flooding the Web Worker with regroup messages on every keystroke while still feeling responsive. The signal update and re-grouping only fire after the user pauses typing.

#### Load More Grows Memory Linearly
Each "Load more" appends 5000 users to the in-memory array. After several loads (e.g., 25,000 users), memory usage grows and re-grouping takes longer. There's no mechanism to unload previous pages. For a production app, a sliding window approach or server-side grouping would be more appropriate, but for the scope of this challenge the simple append model is sufficient.

#### No Smooth Animation for Group Expand/Collapse
Because the virtual scroll works with a flat data array, expanding a group means inserting rows into the array. The CDK viewport renders them instantly at their final positions — there's no built-in way to animate rows sliding in. True smooth group animation would require moving away from virtual scroll or implementing a custom scroll strategy, which conflicts with the performance requirement.

### Performance Summary

| Metric | Approach |
|--------|----------|
| DOM nodes | ~20 visible rows via virtual scroll (not 5000) |
| Grouping | Off main thread via Web Worker |
| Change detection | OnPush + signals — minimal re-checks |
| Search filtering | Main thread (<1ms for 5000 items) |
| Image loading | `loading="lazy"` on user photos |
| API caching | Per-page `shareReplay(1)` prevents duplicate fetches |

### Project Structure

```
src/app/
  components/
    user-list/          # Virtual scroll list with group headers
    user-item/          # Individual user row + expandable details
  services/
    users.service.ts    # HTTP service with per-page caching
    grouping.service.ts # Web Worker wrapper, flattenGroups utility
  workers/
    grouping.worker.ts  # Off-thread grouping computation
  models/
    user.model.ts       # User class with static factory method
    api-result.model.ts # API response interfaces
  pipes/
    country-name.pipe   # Converts country code to full name
    country-flag.pipe   # Converts country code to flag emoji
  mock-data.ts          # Mock dataset for testing/fallback
```
