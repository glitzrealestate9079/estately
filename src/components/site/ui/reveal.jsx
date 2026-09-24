"use client";

import { motion } from "framer-motion";

const DIRECTIONS = {
  up: { y: 24, x: 0 },
  down: { y: -24, x: 0 },
  left: { y: 0, x: 24 },
  right: { y: 0, x: -24 },
  none: { y: 0, x: 0 },
};

// Shared scroll-reveal primitive used across the public site so every
// section animates in consistently (respects prefers-reduced-motion via
// Framer Motion's viewport `once` + a modest, non-distracting distance).
export function Reveal({
  children,
  as: Component = motion.div,
  direction = "up",
  delay = 0,
  duration = 0.55,
  className,
  once = true,
  amount = 0.2,
  ...props
}) {
  const offset = DIRECTIONS[direction] ?? DIRECTIONS.up;
  return (
    <Component
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      {...props}
    >
      {children}
    </Component>
  );
}

export function RevealGroup({ children, className, stagger = 0.08, ...props }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className, direction = "up", ...props }) {
  const offset = DIRECTIONS[direction] ?? DIRECTIONS.up;
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, ...offset },
        show: { opacity: 1, y: 0, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
