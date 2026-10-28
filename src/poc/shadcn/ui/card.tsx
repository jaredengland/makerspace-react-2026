import * as React from 'react';
import { cn } from './utils';

export const Card = ({ className, ...p }: React.ComponentProps<'div'>) =>
  <div data-slot="card" className={cn('rounded-lg border border-border bg-card text-foreground shadow-sm', className)} {...p} />;
export const CardHeader = ({ className, ...p }: React.ComponentProps<'div'>) =>
  <div className={cn('flex flex-col gap-1 p-5 pb-2', className)} {...p} />;
export const CardTitle = ({ className, ...p }: React.ComponentProps<'h2'>) =>
  <h2 className={cn('text-base font-semibold leading-tight', className)} {...p} />;
export const CardContent = ({ className, ...p }: React.ComponentProps<'div'>) =>
  <div className={cn('p-5 pt-2', className)} {...p} />;
