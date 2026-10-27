# Mock dev mode

Run the portal without Rails, MongoDB, Redis or Braintree:

```sh
yarn install --frozen-lockfile
yarn start:mock
```

Open http://localhost:3035 and sign in with any password:

- `admin@example.com` for the staff view (members, billing, rentals, analytics).
- Any other email for a regular member.

`dev.mock.config.js` is the normal dev build with `/api` answered by `mock/server.cjs`
instead of proxied to Rails. Fixtures live in `mock/fixtures.cjs`; all data is invented.
Collections return arrays with a `total-items` header, unknown GET requests return an
empty list, and unknown writes echo the request body, so most screens render. Changes
are kept in memory only for sign-in; other writes are not persisted.

Known gaps: analytics, tool checkouts, workshops, reservations and volunteer screens
show empty or partial data until fixtures are added for them. Add fixtures for a screen
you are working on rather than relying on the empty defaults.

## Static build (no server at all)

`yarn build:static` compiles the same fake API into the browser bundle and writes a
plain static site to `dist-static/` (git-ignored). Upload its contents to any static host.

- The site must be served from a domain root (for example a subdomain). Set
  `STATIC_BASE=/some/path` to experiment with a sub-path, but the app still has a few
  root-relative redirects and links that ignore a sub-path (the expired-session redirect
  in `globalAuthInterceptor.ts`, `loginDestination.ts`, `checkoutDestination.ts`, the footer
  and some fix-ticket links), so a sub-path is not fully supported yet.
- `dist-static/.htaccess` rewrites client-side routes to `index.html` on Apache hosts.
- The signed-in persona is kept in `sessionStorage`, so reloads and deep links stay signed in.
