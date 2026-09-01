
import { useEffect, useRef, useCallback } from 'react';

// ── useIntersectionVisible ────────────────────────────────────────────────────
/**
 * Calls `onVisible(id)` once when the referenced element scrolls into view.
 * Returns a ref to attach to the DOM node.
 *
 * @param {*}        id          Opaque identifier forwarded to onVisible
 * @param {Function} onVisible   Called with id when the element is visible
 * @param {object}  [options]    IntersectionObserver options
 */
export function useIntersectionVisible(id, onVisible, options = { threshold: 0.3 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) onVisible(id);
      });
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
  }, [id, onVisible, options]);

  return ref;
}

// ── useIntersectionOnce ───────────────────────────────────────────────────────
/**
 * Like useIntersectionVisible but fires `callback` only the FIRST time the
 * element enters the viewport (then disconnects).  Used for lazy rendering.
 */
export function useIntersectionOnce(callback, options = { threshold: 0.1 }) {
  const ref = useRef(null);
  const firedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || firedRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !firedRef.current) {
          firedRef.current = true;
          callback();
          observer.disconnect();
        }
      });
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
  }, [callback]);

  return ref;
}

// ── useBottomInfiniteScroll ───────────────────────────────────────────────────
/**
 * Fires `loadMore` when a sentinel element at the bottom of a list scrolls
 * into view.  Only fires when `enabled` is true (i.e., there are more pages
 * and the page list has already been bootstrapped).
 */
export function useBottomInfiniteScroll(loadMore, enabled) {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!bottomRef.current || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { threshold: 0.1 }
    );
    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [loadMore, enabled]);

  return bottomRef;
}