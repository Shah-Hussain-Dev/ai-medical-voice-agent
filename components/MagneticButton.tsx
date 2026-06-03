"use client";

import { motion, useMotionValue, useTransform } from "motion/react";

interface MagneticButtonProps {
  label: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function MagneticButton({ label, href, onClick, className = "" }: MagneticButtonProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const transformX = useTransform(x, (value) => `${value * 0.25}px`);
  const transformY = useTransform(y, (value) => `${value * 0.25}px`);

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - (rect.left + rect.width / 2));
    y.set(event.clientY - (rect.top + rect.height / 2));
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  const content = (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      className={`relative overflow-hidden rounded-[1.5rem] bg-emerald-700 px-7 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_-24px_rgba(15,23,42,0.55)] transition duration-300 ${className}`}
      style={{ x: transformX, y: transformY }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
    >
      {label}
      <span className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_35%)] opacity-60" />
    </motion.button>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }

  return content;
}
