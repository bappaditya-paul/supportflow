import React, { useEffect, useState, useRef } from 'react';

interface RollingCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export const RollingCounter: React.FC<RollingCounterProps> = ({
  value,
  suffix = '',
  prefix = '',
  duration = 1200,
  className = '',
}) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion: show final number immediately
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(value);
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (spanRef.current) {
      observer.observe(spanRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted, value]);

  useEffect(() => {
    if (!hasStarted) return;

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(value);
      return;
    }

    if (value === 0) {
      setCount(0);
      return;
    }

    let start = 0;
    const stepTime = 16;
    const totalSteps = Math.max(1, duration / stepTime);
    const increment = value / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [hasStarted, value, duration]);

  return (
    <span
      ref={spanRef}
      className={`font-mono font-bold tracking-tight inline-block tabular-nums ${className}`}
    >
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};
