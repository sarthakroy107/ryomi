"use client";
import { useEffect, useRef } from "react";
import "./card.css";
import { cn } from "@/lib/utils";

export function GlowCardWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!cardsRef.current) return;

      const cards = cardsRef.current.children;

      for (let i = 0; i < cards.length; i++) {
        const card = cards[i] as HTMLElement;
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div ref={cardsRef} id="cards" className={cn(className)}>
      {children}
    </div>
  );
}

export function GlowCard({
  children,
  onClick,
  className,
}: {
  onClick?: () => void | Promise<void>;
  children: React.ReactNode;
  className?: string;
}) {
  const handleMouseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!onClick) return;
    onClick();
  };

  return (
    <>
      {onClick ? (
        <button
          className={cn(
            `card w-[18rem] text-start focus:outline-none`,
            className
          )}
          onClick={handleMouseClick}
        >
          <div className="card-content p-6 py-8">{children}</div>
          <div className="card-border" />
        </button>
      ) : (
        <div className={cn(`card w-[18rem] text-start cursor-auto`, className)}>
          <div className="card-content p-6 py-8">{children}</div>
          <div className="card-border" />
        </div>
      )}
    </>
  );
}
