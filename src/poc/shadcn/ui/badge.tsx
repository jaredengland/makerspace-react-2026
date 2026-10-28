import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

const badgeVariants = cva('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', {
  variants: {
    variant: {
      default: 'bg-muted text-foreground',
      success: 'bg-success/15 text-success',
      warning: 'bg-warning/15 text-warning',
      destructive: 'bg-destructive/15 text-destructive',
    },
  },
  defaultVariants: { variant: 'default' },
});

export const Badge = ({ className, variant, ...p }: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) =>
  <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...p} />;
