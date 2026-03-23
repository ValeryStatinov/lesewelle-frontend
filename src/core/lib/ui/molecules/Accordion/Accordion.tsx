import { type ComponentProps } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { Accordion as AccordionPrimitive } from 'radix-ui';

import { cn } from 'core/lib/utils/cn';

function Accordion({ className, ...props }: ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot='accordion' className={cn('flex w-full flex-col', className)} {...props} />;
}

function AccordionItem({ className, ...props }: ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item data-slot='accordion-item' className={cn('not-last:border-b', className)} {...props} />
  );
}

function AccordionTrigger({ className, children, ...props }: ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className='flex'>
      <AccordionPrimitive.Trigger
        data-slot='accordion-trigger'
        className={cn(
          `
            group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border
            border-transparent py-2.5 text-left text-sm font-medium transition-all outline-none
            hover:underline
            focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring
            disabled:pointer-events-none disabled:opacity-50
            **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4
            **:data-[slot=accordion-trigger-icon]:text-muted-foreground
          `,
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon
          data-slot='accordion-trigger-icon'
          className={`
            pointer-events-none mt-0.5 shrink-0
            group-aria-expanded/accordion-trigger:hidden
          `}
        />
        <ChevronUpIcon
          data-slot='accordion-trigger-icon'
          className={`
            pointer-events-none mt-0.5 hidden shrink-0
            group-aria-expanded/accordion-trigger:inline
          `}
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({ className, children, ...props }: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot='accordion-content'
      className={`
        overflow-hidden
        data-[state=closed]:animate-accordion-up
        data-[state=open]:animate-accordion-down
      `}
      {...props}
    >
      {/* <div className={cn(`h-(--radix-accordion-content-height)`, className)}>{children}</div> */}
      <div className={className}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
