# MFS VEXORA — Discover. Click. Shop.

A static shopping catalog. Customers browse, search, filter and sort, then **Buy Now** opens each product's own external link in a new tab. There is no checkout, cart, payment or login.

## Files
- `index.html`, `style.css`, `app.js` — the website
- `products.js` — **your products** (the only products ever shown; none are built in)
- `images/` — your product photos
- `admin.html` — offline helper that generates a product entry to paste into `products.js`
- `netlify.toml`, `.nojekyll` — hosting config (no build command needed)

## Add, edit or delete products
1. Open `admin.html`, fill in the form, tap **Copy entry**.
2. Put the photo in `images/` with the filename the helper shows.
3. Paste the entry into `products.js` (comma between products). Delete an entry to remove it, or set `published: false` to hide it.
4. Upload the changed files again. If `products.js` is empty (`[]`), the site shows "No products available yet."

## Security note
This version is a plain static site: there is no server, no secret keys, and nothing to log into. Only whoever can upload files to your hosting account can change products, so protect that account with a strong password and two-factor login. A web admin dashboard with a database needs a backend (e.g. Supabase) and is a separate build.
