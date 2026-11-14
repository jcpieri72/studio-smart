# Studio Smart – guida passo passo

Fai i passaggi in ordine. Ogni volta che trovi **INSERISCI** o un valore da copiare, incollalo esattamente com’è.
Tempo totale: circa un’ora, una volta sola.

## I file della cartella

| File | A cosa serve | Dove va |
|---|---|---|
| index.html, config.js, sw.js, manifest.json, icon-192.png, icon-512.png | l’app | GitHub |
| worker.js | il ponte che custodisce la chiave di Claude | Cloudflare |
| firestore.rules | le regole di sicurezza dei dati | Firebase |
| codice-genitore.html | calcola il tuo codice da genitore | lo apri sul PC, non va caricato |

L’unico file dell’app da modificare è **config.js**.

---

## 1. Firebase (gratuito)

1. Vai su console.firebase.google.com › **Aggiungi progetto** › nome `studio-smart` › Google Analytics non serve.
2. **Authentication** › Inizia › Metodo di accesso › attiva **Google**.
3. Authentication › **Impostazioni** › **Domini autorizzati** › aggiungi `jcpieri72.github.io`.
4. **Firestore Database** › Crea database › posizione `europe-west` › modalità produzione.
5. Firestore › scheda **Regole**: cancella tutto, incolla il contenuto di `firestore.rules`, sostituisci `EMAIL_GENITORE` con la **tua** Gmail (tutta in minuscolo) › **Pubblica**.
6. ⚙️ **Impostazioni progetto** › Le tue app › icona **</>** (App web) › nome `Studio Smart` › Registra.
   Copia i valori `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId` dentro **config.js**.
7. Impostazioni progetto › **Cloud Messaging** › *Certificati push web* › **Genera coppia di chiavi**. Copia la chiave in `vapidKey` di config.js.
8. Impostazioni progetto › **Account di servizio** › **Genera nuova chiave privata** › si scarica un file `.json`.
   Tienilo al sicuro: è una chiave segreta. Ti servono due valori: `client_email` e `private_key`.

## 2. La chiave di Claude

È quella che hai creato nella console di Claude (workspace FisicaFacile/StudioSmart, chiave `tutor-davide`). La incollerai solo nel ponte, al passo 3.

## 3. Il ponte Cloudflare (gratuito)

1. Crea un account su dash.cloudflare.com.
2. **Workers & Pages** › **Create** › **Create Worker** › nome `studio-smart` › **Deploy**.
3. **Edit code**: cancella tutto, incolla il contenuto di `worker.js` › **Deploy**.
4. Torna al worker › **Settings** › **Variables and Secrets** › aggiungi:

| Nome | Tipo | Valore |
|---|---|---|
| ANTHROPIC_API_KEY | Secret | la chiave di Claude |
| SA_PRIVATE_KEY | Secret | `private_key` del file .json (tutto, compreso BEGIN/END) |
| SA_CLIENT_EMAIL | Text | `client_email` del file .json |
| FIREBASE_PROJECT_ID | Text | il projectId (es. `studio-smart-1a2b3`) |
| STUDENT_EMAIL | Text | la Gmail di Davide |
| PARENT_EMAIL | Text | la tua Gmail |
| ALLOWED_ORIGIN | Text | `https://jcpieri72.github.io` |
| APP_URL | Text | `https://jcpieri72.github.io/studio-smart/` |

   Facoltative: `TETTO` (messaggi al giorno, predefinito 60, poi lo cambi dall’area genitore) e `MODEL` (predefinito `claude-haiku-5-5`).
5. Settings › **Triggers** › **Cron Triggers** › aggiungi `*/15 * * * *` (controlla i promemoria ogni 15 minuti).
6. Copia l’indirizzo del worker (es. `https://studio-smart.tuonome.workers.dev`) in `ponteUrl` di config.js.
7. Prova: apri quell’indirizzo nel browser, deve comparire `{"ok":true,"servizio":"Studio Smart"}`.

## 4. Il codice genitore

Apri `codice-genitore.html` sul PC con un doppio clic, scrivi la tua Gmail, premi **Calcola** e copia il codice in `genitoreHash` di config.js.
Serve all’app per riconoscerti e aprire l’area genitore solo a te. La vera protezione dei dati però la fanno le regole di Firebase.

## 5. GitHub Pages

1. Su GitHub (account **jcpieri72**) crea il repository pubblico `studio-smart`.
2. Carica: `index.html`, `config.js` (già compilato), `sw.js`, `manifest.json`, `icon-192.png`, `icon-512.png`.
3. Settings › Pages › branch `main` › Save. Dopo un paio di minuti l’app è su `https://jcpieri72.github.io/studio-smart/`.

I valori in config.js non sono segreti: le chiavi segrete stanno solo in Cloudflare.

## 6. Installazione

**Telefono di Davide (Android)**
1. Apri il link con Chrome › menu ⋮ › **Installa app**.
2. Profilo › **Accedi con Google** con la sua Gmail.
3. Profilo › **Attiva le notifiche** (per i promemoria).
4. Agenda › Orario › **Fotografa** l’orario delle lezioni, poi controllalo.

**Il tuo telefono**
1. Apri lo stesso link e installa l’app.
2. Accedi con la **tua** Gmail: si apre direttamente l’area genitore.
3. Impostazioni › **Usa l’impronta** (o imposta un PIN) e **Attiva le notifiche**.
4. Imposta tetto messaggi, orario del tutor, obiettivo giornaliero e premio.

## 7. Prova finale

Dal telefono di Davide scrivi al tutor “Scrivimi il tema sulle vacanze”.
Il tutor deve rifiutare con gentilezza e proporre di farlo insieme; tu ricevi la notifica e trovi la conversazione in **Segnalazioni**.

## Costi

- GitHub, Firebase e Cloudflare: gratuiti.
- Claude: credito prepagato. Ogni messaggio con Haiku costa circa un decimo di centesimo; nell’area genitore vedi la stima del mese.
- Quando il credito finisce, il tutor si ferma e mostra “Il credito del tutor è finito: avvisa papà”. Tutto il resto dell’app continua a funzionare.

## Se qualcosa non va

- **“Accedi con Google” non fa nulla** → controlla il dominio autorizzato (passo 1.3).
- **“Questo account non è autorizzato”** → controlla STUDENT_EMAIL e PARENT_EMAIL nel ponte.
- **“Il ponte non riesce ad accedere a Firebase”** → ricontrolla SA_CLIENT_EMAIL e SA_PRIVATE_KEY.
- **L’area genitore è vuota** → Davide deve aver fatto l’accesso almeno una volta dal suo telefono.
