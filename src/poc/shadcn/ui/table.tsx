import * as React from 'react';
import { cn } from './utils';

export const Table = ({ className, ...p }: React.ComponentProps<'table'>) =>
  <div className="w-full overflow-x-auto"><table className={cn('w-full text-sm', className)} {...p} /></div>;
export const TableHead = (p: React.ComponentProps<'thead'>) => <thead className="text-left text-muted-foreground" {...p} />;
export const TableRow = ({ className, ...p }: React.ComponentProps<'tr'>) =>
  <tr className={cn('border-b border-border last:border-0', className)} {...p} />;
export const TableHeaderCell = ({ className, ...p }: React.ComponentProps<'th'>) =>
  <th className={cn('px-3 py-2 font-medium', className)} {...p} />;
export const TableCell = ({ className, ...p }: React.ComponentProps<'td'>) =>
  <td className={cn('px-3 py-3', className)} {...p} />;
