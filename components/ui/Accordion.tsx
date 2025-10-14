'use client';

import { useState } from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

export function Accordion({ title, children }: AccordionProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-slate-700"
        aria-expanded={open}
      >
        {title}
        <span>{open ? '−' : '+'}</span>
      </button>
      {open ? <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-600">{children}</div> : null}
    </div>
  );
}
