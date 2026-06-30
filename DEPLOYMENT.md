# Deploying to Hostinger (Business/Premium shared hosting)

This app is a Node.js server (Express + tRPC) that serves a built React
frontend. Hostinger's hPanel Node.js app manager runs it via Passenger.

## 1. Database

In hPanel, create a MySQL database and user. Copy the connection string into
`DATABASE_URL` (see `.env.example`), e.g.:

```
mysql://USER:PASSWORD@localhost:3306/DBNAME
```

Run migrations once you have a shell (SSH or hPanel's terminal):

```
npm install
npm run db:push
node seed-products.mjs   # optional: seed product rows
```

## 2. Node.js app (hPanel)

1. hPanel → Advanced → Node.js → Create application.
2. Application root: this repo's directory.
3. Application startup file: `dist/index.js`.
4. Set Node version to the latest available (18+).
5. Add environment variables from `.env.example` (`DATABASE_URL`, `NODE_ENV=production`,
   `KIT_API_KEY`, `KIT_FORM_ID`). Do **not** set `PORT` manually — Passenger
   assigns it and the app reads `process.env.PORT` automatically.

## 3. Build

Either build locally and upload `dist/` + `node_modules`, or build on the
server via hPanel's terminal / SSH:

```
npm install
npm run build
```

This produces `dist/index.js` (server) and `dist/public` (static client
assets) which `serveStatic` reads in production.

## 4. Git deploy

hPanel supports pulling from a Git repository. Point it at this repo's
`main` branch (or your chosen branch) and configure it to run
`npm install && npm run build` after each pull, then restart the Node app.

## 5. Restart

After setting env vars or pulling new code, restart the app from hPanel's
Node.js page for changes to take effect.

## Notes

- The logo and other static assets are now served directly from
  `client/public` (no external storage dependency).
- The email signup form posts to Kit's REST API directly using `KIT_API_KEY`;
  if unset, signups are still recorded in the database but won't sync to Kit.
- Login/account pages and the old Stripe checkout were already removed —
  all products are sold via external Gumroad links.
