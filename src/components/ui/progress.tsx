import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function Progress({
  value = 0,
  max = 100,
  className,
  barClassName
}: {
  value?: number;
  max?: number;
  className?: string;
  barClassName?: string;
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100', className)}>
      <div
        className={cn('h-full bg-indigo-600 transition-all duration-300 ease-in-out', barClassName)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
