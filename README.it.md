# QR Redirector

Pagina di destinazione minimale per codici QR. Reindirizza i visitatori a qualsiasi URL tu scelga, registrando ogni scansione in modo da sapere sempre quante volte il codice è stato utilizzato. Per impostazione predefinita, tutto funziona su servizi gratuiti.

---

## ✨ Funzionalità

- **Reindirizzamento immediato** – aggiorna una costante in `index.html` e sei pronto per il deploy.
- **Analisi gratuita** – CountAPI tiene un conteggio continuo senza bisogno di account o costi di server.
- **Dashboard gradevole** – `stats.html` mostra i totali in tempo reale e le istantanee storiche.
- **Pronto per Cloudflare Worker** – backend opzionale per maggiore affidabilità e domini personalizzati.
- **Funziona su GitHub Pages** – solo hosting statico; non è richiesta nessuna pipeline di build speciale.

---

## 🗺️ Struttura del Progetto

| Percorso | Scopo |
| --- | --- |
| `index.html` | Pagina di reindirizzamento + logger delle scansioni (CountAPI o Worker).
| `stats.html` | Dashboard che legge i totali da CountAPI / Worker più le istantanee archiviate.
| `scansioni/log.json` | Cronologia delle istantanee giornaliere aggiunte dalla GitHub Action.
| `.github/workflows/` | Workflow opzionali per creare istantanee e pubblicare il pixel di tracciamento.
| `worker/` | Cloudflare Worker (Typescript) che sostituisce CountAPI se desideri un backend proprietario.

---

## 🚀 Avvio Rapido (GitHub Pages + CountAPI)

1.  **Fai un fork o clona questo repository.**
2.  **Imposta l'URL di reindirizzamento.** In `index.html`, modifica la costante `TARGET_URL` all'inizio dello script. Opzionalmente, personalizza `COUNT_NAMESPACE` / `COUNT_KEY` per ottenere il tuo bucket su CountAPI.
3.  **Abilita GitHub Pages.** Vai su *Settings → Pages → Deploy from a branch* e scegli `main` / `root`. Il tuo URL pubblico diventerà `https://<username>.github.io/qr-redirector/` (o il nome della repo).
4.  **Genera il codice QR.**
    ```bash
    # Esempio per macOS – installa qrencode una volta
    brew install qrencode
    qrencode -o qr.png "https://<username>.github.io/qr-redirector/"
    ```
5.  **Condividi e monitora.** Indirizza gli scanner al nuovo link. Visita `https://<username>.github.io/qr-redirector/stats.html` per vedere i totali in tempo reale.

CountAPI mantiene un contatore globale per ogni coppia namespace/chiave. Se vuoi ricominciare da capo, basta cambiare i valori in `index.html`.

---

## ⚙️ Opzionale: Contatore Self-Hosted (Cloudflare Worker)

CountAPI è ottimo per progetti veloci, ma potresti incorrere in limiti di richieste con traffico intenso. Distribuisci il Worker per mantenere tutto sotto il tuo controllo.

1.  Requisiti: account Cloudflare gratuito, `npm`, `wrangler` (`npm i -g wrangler`).
2.  Nella dashboard di Cloudflare, crea un namespace KV (es. `SCANS_KV`) e copia il suo `id` / `preview_id` in `worker/wrangler.toml`.
3.  Esegui il deploy:
    ```bash
    cd worker
    wrangler deploy
    ```
4.  Prendi nota dell'URL del worker, ad esempio `https://qr-redirector-counter.<sottodominio>.workers.dev`.
5.  Informa il frontend (una volta per dispositivo o in modo permanente nel codice):
    ```js
    localStorage.setItem('qr_worker_base', 'https://qr-redirector-counter.<sottodominio>.workers.dev');
    ```

La pagina di reindirizzamento ora contatterà `/hit` sul tuo Worker e la dashboard leggerà da `/get`, quindi il traffico non passerà mai per CountAPI.

---

## 🎯 Consigli e Personalizzazioni

- **Dominio personalizzato** – aggiungi un file `CNAME` e configura il DNS per servire la pagina dal tuo hostname, in modo che gli scanner vedano `https://qr.tuodominio.com` invece di GitHub Pages.
- **Azzerare il contatore** – con CountAPI devi scegliere una nuova coppia namespace/chiave; con il Worker puoi azzerare manualmente il valore nel KV.
- **Debug locale** – apri `index.html` direttamente in un browser e controlla la console degli Strumenti per Sviluppatori per verificare che le richieste di logging vadano a buon fine.
- **Accessibilità** – aggiorna il testo all'interno della card di atterraggio per spiegare dove porta il reindirizzamento, nel caso in cui il browser di qualcuno blocchi il reindirizzamento automatico.

---

## 📄 Licenza

MIT — sentiti libero di usare questo template per le tue campagne QR e di modificarlo secondo le tue esigenze.
