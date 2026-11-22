# ERP Console: standalone frontend for ERPNext

A React + TypeScript (Vite) UI that talks to your ERPNext instance purely over its REST API.
All business logic stays in ERPNext; this app only reads and presents data.

## Run it

```bash
cp .env.example .env        # set ERPNEXT_URL to your site
npm install
npm run dev                 # http://localhost:5173
```

In dev, Vite proxies `/api`, `/files` and `/private/files` to `ERPNEXT_URL`, so the browser sees one
origin: no CORS setup, and the ERPNext session cookie works.

## How it connects

| Need            | ERPNext endpoint used                                   |
| --------------- | ------------------------------------------------------- |
| Login / logout  | `POST /api/method/login`, `GET /api/method/logout`      |
| Who am I        | `GET /api/method/frappe.auth.get_logged_user`           |
| Lists           | `GET /api/resource/<DocType>` (fields, filters, paging) |
| Single record   | `GET /api/resource/<DocType>/<name>`                    |
| Counts          | `GET /api/method/frappe.client.get_count`               |
| Custom logic    | `callMethod("your_app.api.fn", {...})` in `src/api/frappe.ts` |

Permissions are enforced by ERPNext per logged-in user, so the UI only shows what that user may see.

## Adding a doctype

Add one entry to `src/config/resources.ts` (doctype, slug, columns, search fields). It gets a sidebar
link, a list page with search and paging, and a detail page including child tables.

## Production

Serve the built app (`npm run build`, then the `dist/` folder) from the same domain as ERPNext, for
example with nginx routing `/api` and `/files` to ERPNext and everything else to `dist/`. Same-origin
keeps session cookies simple. If you must use a different domain, you will need CORS and cookie
settings (`allow_cors`, `SameSite=None; Secure`) on the ERPNext site.

## Known limits of this first version

- **Read-only.** Creating, editing and submitting documents are not implemented. Frappe requires a
  CSRF token (`X-Frappe-CSRF-Token`) on session-authenticated writes, and a standalone SPA has no
  built-in way to get one. Decide between a small whitelisted endpoint in your ERPNext app that
  returns the token, or API key/secret auth through a server-side proxy, before adding forms.
- Search results show a "shown" count instead of a total, because `get_count` does not support OR filters.
- Doctype fields in `resources.ts` assume standard ERPNext/HRMS field names; adjust for customisations.
- Dependencies were not installed or built in the environment that generated this, so run
  `npm install && npm run build` once to catch any type errors.
