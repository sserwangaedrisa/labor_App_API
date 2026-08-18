import React, { useEffect, useRef, useState, type JSX } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  suffix = "",
  duration = 1600,
}): JSX.Element => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (!inView) return;

    let animationFrame: number;
    const startTime = performance.now();

    const tick = (now: number): void => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(eased * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(tick);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [inView, value, duration]);

  return (
    <span ref={ref} className="font-display tabular-nums">
      {count}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
