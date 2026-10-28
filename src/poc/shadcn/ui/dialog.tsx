import * as React from 'react';
import * as D from '@radix-ui/react-dialog';
import { cn } from './utils';

export const Dialog = D.Root;
export const DialogTrigger = D.Trigger;
export const DialogClose = D.Close;
export const DialogTitle = ({ className, ...p }: React.ComponentProps<typeof D.Title>) =>
  <D.Title className={cn('text-lg font-semibold', className)} {...p} />;
export const DialogDescription = ({ className, ...p }: React.ComponentProps<typeof D.Description>) =>
  <D.Description className={cn('text-sm text-muted-foreground', className)} {...p} />;

// Radix portals to <body>, outside .sc-root, so the content re-applies the scoped base via data-sc.
export const DialogContent = ({ className, children, ...p }: React.ComponentProps<typeof D.Content>) => (
  <D.Portal>
    <D.Overlay className="fixed inset-0 z-[1300] bg-black/50" />
    <D.Content
      data-sc
      className={cn('fixed left-1/2 top-1/2 z-[1301] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-card p-6 text-foreground shadow-lg flex flex-col gap-3 font-sans', className)}
      {...p}
    >
      {children}
    </D.Content>
  </D.Portal>
);
