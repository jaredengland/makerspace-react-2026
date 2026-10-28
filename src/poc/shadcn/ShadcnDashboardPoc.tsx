import * as React from 'react';
import cssText from './shadcn.css';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableCell, TableHead, TableHeaderCell, TableRow } from './ui/table';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from './ui/dialog';

// Same string-injection approach the app already uses for Leaflet CSS (webpack asset/source).
const useShadcnStyles = () => {
  React.useEffect(() => {
    const el = document.createElement('style');
    el.setAttribute('data-shadcn-poc', '');
    el.textContent = cssText as unknown as string;
    document.head.appendChild(el);
    return () => { el.remove(); };
  }, []);
};

const checkouts = [
  { tool: 'Table saw', shop: 'Woodshop', status: 'Approved' },
  { tool: 'Laser cutter', shop: 'Laser Lab', status: 'Pending' },
  { tool: 'Lathe', shop: 'Metal Shop', status: 'Expired' },
];
const badge = { Approved: 'success', Pending: 'warning', Expired: 'destructive' } as const;

export default function ShadcnDashboardPoc() {
  useShadcnStyles();
  return (
    <div className="sc-root bg-background text-foreground min-h-screen p-4 md:p-8 font-sans">
      <div className="mx-auto flex max-w-5xl gap-6">
        <main className="flex-1 flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Dashboard <span className="text-primary">(shadcn/ui proof of concept)</span></h1>
          <Card className="border-l-4 border-l-primary">
            <CardHeader><CardTitle>Needs your attention</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <Badge variant="destructive">Dues past due</Badge>
              <span className="text-sm text-muted-foreground">Your membership renewal was due 3 days ago.</span>
              <Button className="ml-auto">Pay dues</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Safety checkouts</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHead><TableRow><TableHeaderCell>Tool</TableHeaderCell><TableHeaderCell>Shop</TableHeaderCell><TableHeaderCell>Status</TableHeaderCell></TableRow></TableHead>
                <tbody>
                  {checkouts.map(c => (
                    <TableRow key={c.tool}><TableCell>{c.tool}</TableCell><TableCell>{c.shop}</TableCell>
                      <TableCell><Badge variant={badge[c.status as keyof typeof badge]}>{c.status}</Badge></TableCell></TableRow>
                  ))}
                </tbody>
              </Table>
            </CardContent>
          </Card>
          <div className="flex flex-wrap gap-3">
            <Dialog>
              <DialogTrigger asChild><Button variant="secondary">Request a checkout</Button></DialogTrigger>
              <DialogContent>
                <DialogTitle>Request a checkout</DialogTitle>
                <DialogDescription>Focus is trapped, Escape closes, and the title and description are announced by screen readers (Radix).</DialogDescription>
                <div className="flex justify-end gap-2"><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button>Send request</Button></div>
              </DialogContent>
            </Dialog>
            <Button variant="outline">Report a problem</Button>
            <Button variant="ghost" size="sm">Small ghost</Button>
          </div>
        </main>
        <nav aria-label="Primary" className="hidden md:flex w-48 shrink-0 flex-col gap-1 rounded-lg bg-secondary p-3 text-secondary-foreground self-start">
          {['Dashboard', 'Workshops', 'Volunteer', 'Me', 'Settings'].map((x, i) => (
            <a key={x} href="#" className={'rounded-lg px-3 py-2 text-sm no-underline text-inherit ' + (i === 0 ? 'bg-primary text-primary-foreground' : 'hover:bg-white/10')}>{x}</a>
          ))}
        </nav>
      </div>
    </div>
  );
}
