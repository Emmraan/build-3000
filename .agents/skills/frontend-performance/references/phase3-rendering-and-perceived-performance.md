# Phase 3 — Optimization Implementation: Rendering and Perceived Performance

Detailed reference backing the "Phase 3" decision point in SKILL.md, part 3: rendering performance optimizations (Step 19) and perceived performance optimizations (Step 20).

---

19. **Implement rendering performance optimizations.** Provide specific patterns for preventing unnecessary work:

    **React re-render prevention:**
    ```typescript
    // 1. State colocation: move state down to the component that needs it
    // BAD: State in parent causes all children to re-render
    function Parent() {
      const [searchQuery, setSearchQuery] = useState('');
      return (
        <div>
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
          <ExpensiveUnrelatedComponent /> {/* re-renders on every keystroke! */}
          <SearchResults query={searchQuery} />
        </div>
      );
    }
    // GOOD: Extract stateful subtree
    function Parent() {
      return (
        <div>
          <SearchFeature /> {/* state stays inside */}
          <ExpensiveUnrelatedComponent /> {/* never re-renders from search state */}
        </div>
      );
    }

    // 2. Children as props pattern (composition, not memoization)
    function ScrollTracker({ children }: { children: ReactNode }) {
      const [scrollY, setScrollY] = useState(0);
      useEffect(() => {
        const handler = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handler, { passive: true });
        return () => window.removeEventListener('scroll', handler);
      }, []);
      return (
        <div>
          <ScrollIndicator position={scrollY} />
          {children} {/* children don't re-render when scrollY changes */}
        </div>
      );
    }

    // 3. React.memo — only for measured performance problems
    const DataRow = React.memo(function DataRow({ item }: { item: DataItem }) {
      return <tr>...</tr>;
    });
    // Custom comparator for complex props
    const DataRow = React.memo(DataRowComponent, (prev, next) => prev.item.id === next.item.id && prev.item.updatedAt === next.item.updatedAt);

    // 4. useMemo / useCallback — only when passing to memoized children or expensive computation
    const filteredItems = useMemo(
      () => items.filter(item => item.name.includes(searchQuery)),
      [items, searchQuery]
    );

    // 5. Key management for lists
    // BAD: index as key (breaks when list reorders, causes unnecessary DOM reconciliation)
    {items.map((item, index) => <ItemCard key={index} item={item} />)}
    // GOOD: stable, unique ID as key
    {items.map(item => <ItemCard key={item.id} item={item} />)}
    ```

    **Virtualization for long lists:**
    ```typescript
    import { useVirtualizer } from '@tanstack/react-virtual';

    function VirtualizedList({ items }: { items: Item[] }) {
      const parentRef = useRef<HTMLDivElement>(null);
      const virtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 64, // estimated row height in px
        overscan: 5, // render 5 extra items above/below viewport
      });

      return (
        <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
          <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
            {virtualizer.getVirtualItems().map(virtualRow => (
              <div key={virtualRow.key}
                   style={{ position: 'absolute', top: 0, left: 0, width: '100%',
                            height: `${virtualRow.size}px`,
                            transform: `translateY(${virtualRow.start}px)` }}>
                <ItemRow item={items[virtualRow.index]} />
              </div>
            ))}
          </div>
        </div>
      );
    }
    ```

    **Web Worker offloading for CPU-intensive tasks:**
    ```typescript
    // worker.ts
    self.addEventListener('message', (event) => {
      const { type, payload } = event.data;
      if (type === 'FILTER_AND_SORT') {
        const result = heavyFilterAndSort(payload.items, payload.criteria);
        self.postMessage({ type: 'RESULT', payload: result });
      }
    });

    // component.ts — using comlink for ergonomic worker API
    import { wrap } from 'comlink';
    const worker = wrap<WorkerAPI>(new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' }));
    const filteredItems = await worker.filterAndSort(items, criteria);
    ```

20. **Implement perceived performance optimizations.** Even when actual performance is optimized, perceived performance determines user satisfaction:

    **Skeleton screens:**
    - Display content-shaped placeholders matching the final layout dimensions during loading.
    - Skeletons should pulse/animate subtly to indicate loading (not static gray boxes).
    - Transition from skeleton to content without layout shift (same dimensions).
    - Use CSS-only skeletons where possible (no JS overhead):
      ```css
      .skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: skeleton-pulse 1.5s ease-in-out infinite;
      }
      @keyframes skeleton-pulse {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      ```

    **Optimistic UI updates:**
    - For mutations with predictable outcomes (like, bookmark, toggle, simple edits), update the UI immediately before the API responds.
    - Define the rollback strategy: revert the UI change and show an error toast if the API request fails.
    - TanStack Query `useMutation` with `onMutate` (optimistic update) and `onError` (rollback) is the recommended pattern.

    **Instant navigation:**
    - Prefetch data for likely next pages on link hover or viewport intersection.
    - Use `startTransition` (React 18+) for non-urgent navigation updates to keep the current page interactive.
    - Show a progress indicator only if navigation takes > 300ms (avoid flashing indicators for fast navigations).

    **Progressive loading:**
    - Load and render content in priority order: critical above-the-fold content first, then secondary content, then enhancements.
    - Use `Suspense` boundaries at strategic points to progressively reveal content as data arrives.
    - For SSR: use streaming SSR to send HTML progressively as data becomes available on the server.