"use client";

import { useFadeIn } from "@/lib/useFadeIn";

interface Props {
  children: React.ReactNode;
  delay?: "0" | "100" | "200";
}

const DELAYS = {
  "0": "delay-0",
  "100": "delay-100",
  "200": "delay-200",
};

export default function FadeInSection({ children, delay = "0" }: Props) {
  const { ref, visible } = useFadeIn();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${DELAYS[delay]} ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
