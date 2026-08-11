import * as React from "react";

type Size = {
  width: number;
  height: number;
};

export function useSize<T extends HTMLElement>(
  ref: React.RefObject<T>,
): Size | null {
  const [size, setSize] = React.useState<Size | null>(null);

  React.useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    setSize({ width: rect.width, height: rect.height });

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return size;
}
