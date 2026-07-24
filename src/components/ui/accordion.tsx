import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface AccordionContextType {
  openItems: string[];
  toggleItem: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextType | undefined>(undefined);

export function Accordion({
  type = 'single',
  collapsible = true,
  children,
  className
}: {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const [openItems, setOpenItems] = React.useState<string[]>([]);

  const toggleItem = (val: string) => {
    if (type === 'single') {
      if (openItems.includes(val)) {
        if (collapsible) setOpenItems([]);
      } else {
        setOpenItems([val]);
      }
    } else {
      if (openItems.includes(val)) {
        setOpenItems(openItems.filter((i) => i !== val));
      } else {
        setOpenItems([...openItems, val]);
      }
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={cn('divide-y divide-slate-200 border-y border-slate-200', className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

const AccordionItemContext = React.createContext<{ value: string }>({ value: '' });

export function AccordionItem({
  value,
  children,
  className
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
  key?: React.Key;
}) {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div className={cn('py-1', className)}>{children}</div>
    </AccordionItemContext.Provider>
  );
}

export function AccordionTrigger({
  value,
  children,
  className
}: {
  value?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(AccordionContext);
  const itemCtx = React.useContext(AccordionItemContext);
  if (!ctx) throw new Error('AccordionTrigger must be used within Accordion');
  const itemVal = value || itemCtx?.value;

  const isOpen = itemVal ? ctx.openItems.includes(itemVal) : false;

  return (
    <button
      type="button"
      onClick={() => itemVal && ctx.toggleItem(itemVal)}
      className={cn(
        'flex w-full items-center justify-between py-4 text-left text-base font-semibold text-slate-900 transition-all hover:text-indigo-600 cursor-pointer',
        className
      )}
    >
      {children}
      <ChevronDown
        className={cn('h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200', isOpen && 'rotate-180 text-indigo-600')}
      />
    </button>
  );
}

export function AccordionContent({
  value,
  children,
  className
}: {
  value?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(AccordionContext);
  const itemCtx = React.useContext(AccordionItemContext);
  if (!ctx) throw new Error('AccordionContent must be used within Accordion');
  const itemVal = value || itemCtx?.value;

  const isOpen = itemVal ? ctx.openItems.includes(itemVal) : false;

  if (!isOpen) return null;

  return (
    <div className={cn('pb-4 pt-0 text-sm leading-relaxed text-slate-600 animate-in fade-in-0 duration-200', className)}>
      {children}
    </div>
  );
}
