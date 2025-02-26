import React from "react";

interface SectionDividerProps {
  title: string;
  className?: string;
}

export function SectionDivider({ title, className = "" }: SectionDividerProps) {
  return (
    <div className={`flex w-full items-center ${className}`}>
      <div className="flex-1 my-12 h-[2px] bg-black"></div>
      <span className="text-4xl font-bold text-center mx-8 py-3">
        {title}
      </span>
      <div className="flex-1 my-12 h-[2px] bg-black"></div>
    </div>
  );
}