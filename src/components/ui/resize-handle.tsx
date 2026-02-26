"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseResizableOptions {
  defaultWidth: number;
  minWidth?: number;
  maxWidth?: number;
  storageKey?: string;
}

export function useResizable({
  defaultWidth,
  minWidth = 200,
  maxWidth = 480,
  storageKey,
}: UseResizableOptions) {
  const [width, setWidth] = useState(defaultWidth);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);
  const widthRef = useRef(width);

  // Restore from localStorage after mount (avoids hydration mismatch)
  useEffect(() => {
    if (!storageKey) return;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed)) {
          setWidth(Math.max(minWidth, Math.min(maxWidth, parsed)));
        }
      }
    } catch {
      // ignore
    }
  }, [storageKey, minWidth, maxWidth]);

  useEffect(() => {
    widthRef.current = width;
  }, [width]);

  const onDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    startX.current = e.clientX;
    startWidth.current = widthRef.current;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = e.clientX - startX.current;
      setWidth(
        Math.max(minWidth, Math.min(maxWidth, startWidth.current + delta))
      );
    };

    const onMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, String(widthRef.current));
        } catch {
          // ignore
        }
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [minWidth, maxWidth, storageKey]);

  return { width, onDragStart };
}

export function ResizeHandle({
  onMouseDown,
}: {
  onMouseDown: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      onMouseDown={onMouseDown}
      className="relative w-px flex-shrink-0 cursor-col-resize bg-border after:absolute after:inset-y-0 after:-left-1 after:w-3 after:content-[''] hover:bg-primary/50 active:bg-primary"
    />
  );
}
