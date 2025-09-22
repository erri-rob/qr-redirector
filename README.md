# QR Redirector (GitHub Pages + CountAPI + Actions)

Soluzione 100% gratuita e open‑source per QR con redirect e conteggio visite.

## Target di redirect

Attuale URL:
- https://www.rainews.it/tgr/piemonte/video/2023/03/tgr-piemonte-web-moricone-satelliti-militari-pl-sicral-centro-interforze-ucraina-1cc6d906-e8ff-4459-b243-82501d24c32f.html

Cambia `TARGET_URL` in `index.html` per aggiornare la destinazione.

## Struttura

- `index.html`: redirect + incremento contatore
- `scansioni/log.json`: storico snapshot del contatore
- `.github/workflows/tracker.yml`: workflow che salva uno snapshot al giorno

## Abilitare GitHub Pages

1) Pusha il repo su GitHub
2) Settings → Pages → Deploy from a branch → `main` / root
3) URL risultante: `https://<username>.github.io/qr-redirector/`

## Generare il QR

Installare `qrencode` (macOS: `brew install qrencode`) e poi:
```bash
qrencode -o qr.png "https://<username>.github.io/qr-redirector/"
```

## Leggere il contatore corrente
```bash
curl -sSL "https://api.countapi.xyz/get/qr-redirector/scansioni-pagina"
```

## Note
- Il redirect funziona anche se CountAPI è irraggiungibile
- Gli snapshot vengono salvati in `scansioni/log.json`

Licenza: MIT
