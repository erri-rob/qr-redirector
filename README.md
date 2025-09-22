# QR Redirector

Minimal landing page for QR codes. It redirects visitors to any URL you choose while logging each scan so you always know how many times the code has been used. Everything runs on free services by default.

---

## ✨ Features

- **Drop-in redirect** – update one constant in `index.html` and you’re ready to deploy.
- **Free analytics** – CountAPI keeps a running tally without accounts or server costs.
- **Nice-looking dashboard** – `stats.html` shows live totals and historical snapshots.
- **Cloudflare Worker ready** – optional backend for higher reliability and custom domains.
- **Works on GitHub Pages** – static hosting only; no special build pipeline required.

---

## 🗺️ Project Structure

| Path | Purpose |
| --- | --- |
| `index.html` | Redirect page + scan logger (CountAPI or Worker).
| `stats.html` | Dashboard that reads CountAPI / Worker totals plus stored snapshots.
| `scansioni/log.json` | Daily snapshot history appended by the GitHub Action.
| `.github/workflows/` | Optional workflows for snapshotting and publishing the tracking pixel.
| `worker/` | Cloudflare Worker (Typescript) that replaces CountAPI if you want your own backend.

---

## 🚀 Quick Start (GitHub Pages + CountAPI)

1. **Fork or clone this repository.**
2. **Set the redirect target.** In `index.html`, change the `TARGET_URL` constant at the top of the script. Optionally customize `COUNT_NAMESPACE` / `COUNT_KEY` to get your own CountAPI bucket.
3. **Enable GitHub Pages.** Go to *Settings → Pages → Deploy from a branch* and choose `main` / root. Your public URL becomes `https://<username>.github.io/qr-redirector/` (or the repo name).
4. **Generate the QR code.**
   ```bash
   # macOS example – install qrencode once
   brew install qrencode
   qrencode -o qr.png "https://<username>.github.io/qr-redirector/"
   ```
5. **Share & monitor.** Point scanners to the new link. Visit `https://<username>.github.io/qr-redirector/stats.html` to see live totals.

CountAPI keeps a global counter per namespace/key pair. If you ever want to start fresh, just change the values in `index.html`.

---

## ⚙️ Optional: Self-Hosted Counter (Cloudflare Worker)

CountAPI is great for quick projects, but rate limits may appear on heavy traffic. Deploy the Worker to keep everything under your control.

1. Requirements: free Cloudflare account, `npm`, `wrangler` (`npm i -g wrangler`).
2. In the Cloudflare dashboard, create a KV namespace (e.g. `SCANS_KV`) and copy its `id` / `preview_id` into `worker/wrangler.toml`.
3. Deploy:
   ```bash
   cd worker
   wrangler deploy
   ```
4. Note the worker URL, for example `https://qr-redirector-counter.<subdomain>.workers.dev`.
5. Inform the frontend (one-time per device or hard-coded):
   ```js
   localStorage.setItem('qr_worker_base', 'https://qr-redirector-counter.<subdomain>.workers.dev');
   ```

The redirect page now hits `/hit` on your Worker and the dashboard reads `/get`, so traffic never touches CountAPI.

---

## 🎯 Tips & Customizations

- **Custom domain** – add a `CNAME` file and configure DNS to serve the page from your own hostname, so scanners see `https://qr.yourdomain.com` instead of GitHub Pages.
- **Resetting the counter** – with CountAPI you must pick a new namespace/key; with the Worker you can reset the KV value manually.
- **Local debugging** – open `index.html` directly in a browser and check the DevTools console to verify the logging requests succeed.
- **Accessibility** – update the text inside the landing card to explain where the redirect goes if someone’s browser blocks the automatic redirect.

---

## 📄 License

MIT — feel free to use this template for your own QR campaigns and tweak it to your needs.
