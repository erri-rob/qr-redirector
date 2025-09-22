# QR Redirector

Pagina di atterraggio minimale per QR code: reindirizza l’utente verso un URL a scelta e registra ogni hit per conoscere quante scansioni sono state fatte. Funziona interamente con servizi gratuiti.

## Come funziona

- **`index.html`** effettua un redirect immediato a `TARGET_URL` e, prima di lasciare la pagina, invia una richiesta di conteggio a CountAPI (con fallback su countapi.dev e, in ultima istanza, su un asset GitHub Release). Se si imposta un backend personale Cloudflare Worker, viene usato al posto di CountAPI.
- **`stats.html`** mostra il totale live leggendo le API di CountAPI (o il Worker) e utilizza `scansioni/log.json` come storico giornaliero.
- **`.github/workflows/`** contiene workflow opzionali: uno per creare l’asset `pixel.gif` su un release e uno per salvare uno snapshot giornaliero del contatore.

## Setup per il proprio link

1. **Fork/Clona il repo.**
2. **Imposta l’URL di destinazione.** Apri `index.html` e modifica `TARGET_URL` (righe iniziali dello script).
   - Facoltativo: cambia `COUNT_NAMESPACE`/`COUNT_KEY` per avere un contatore dedicato.
3. **Attiva GitHub Pages.**
   - Repository → Settings → Pages → “Deploy from a branch” → `main` / root.
   - L’URL risultante sarà `https://<username>.github.io/qr-redirector/` (o il nome del tuo repo).
4. **Genera il QR.**
   ```bash
   # macOS: brew install qrencode
   qrencode -o qr.png "https://<username>.github.io/qr-redirector/"
   ```
5. **Controlla le statistiche.** Apri `https://<username>.github.io/qr-redirector/stats.html` per vedere il totale live e, se abiliti il workflow, lo storico giornaliero.

## Opzione backend consigliata (Cloudflare Worker + KV)

CountAPI è gratuito ma soggetto a throttling. Per un contatore più affidabile, deploya il Worker incluso:

1. Prerequisiti: account Cloudflare gratuito, `npm`, `wrangler` (`npm i -g wrangler`).
2. Crea un namespace KV e copia `id` e `preview_id` in `worker/wrangler.toml`.
3. Deploy dal repo:
   ```bash
   cd worker
   wrangler deploy
   ```
4. Recupera l’URL del Worker (es. `https://qr-redirector-counter.<subdomain>.workers.dev`).
5. Salvalo nel browser che usa il QR (o nel file JS se preferisci) con:
   ```js
   localStorage.setItem('qr_worker_base', 'https://qr-redirector-counter.<subdomain>.workers.dev');
   ```

Da quel momento la pagina userà `/hit` e `/get` del Worker per registrare e leggere le scansioni.

## Consigli aggiuntivi

- **Dominio personalizzato:** GitHub Pages supporta un file `CNAME`; se possiedi un dominio, il QR mostrerà la tua URL personalizzata.
- **Reset contatore:** CountAPI non permette azzeramento; usa una nuova coppia namespace/key oppure passa al Worker.
- **Debug locale:** apri `index.html` in un browser; la console mostrerà eventuali errori di rete verso CountAPI/Worker.

Licenza MIT.
