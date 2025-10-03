import React from "react";

interface SectionDividerProps {
  title: string;
  className?: string;
}

export function SectionDivider({ title, className = "" }: SectionDividerProps) {
  return (
    <div className={`flex w-full items-center ${className}`}>
      <div className="flex-1 my-12 h-[2px] bg-black"></div>
      <span className="mx-4 py-3 text-3xl font-bold text-center md:mx-6 md:text-4xl">
        {title}
      </span>
      <div className="flex-1 my-12 h-[2px] bg-black"></div>
    </div>
  );
}
