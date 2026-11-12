# FisicaFacile – come metterla online

## 1. GitHub Pages
1. Su GitHub (utente jcpieri72) crea un nuovo repository pubblico, per esempio `fisica-facile`.
2. Carica questi file: `index.html`, `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`.
3. Settings › Pages › Branch `main` › Save.
4. Dopo un minuto l'app è su `https://jcpieri72.github.io/fisica-facile/`.

L'app funziona già così: i progressi restano sul dispositivo.

## 2. Sincronizzazione PC/cellulare (Firebase gratuito)
1. Su console.firebase.google.com crea il progetto `fisica-facile` (piano Spark, gratuito).
2. Authentication › Metodo di accesso › attiva **Google**.
3. Authentication › Impostazioni › Domini autorizzati › aggiungi `jcpieri72.github.io`.
4. Firestore Database › Crea database › poi nella scheda **Regole** incolla:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /studenti/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```
5. Impostazioni progetto › Le tue app › aggiungi app Web (`</>`), copia `apiKey`, `authDomain`, `projectId`, `appId`.
6. In `index.html` cerca `INSERISCI_API_KEY` e sostituisci i quattro valori, poi ricarica il file su GitHub.

Ogni studente vede solo i propri progressi.

## 3. Installarla
- **Cellulare Android:** apri il link in Chrome › menu ⋮ › Aggiungi a schermata Home / Installa app.
- **PC:** apri il link in Chrome o Edge › icona di installazione nella barra degli indirizzi.

Davide entra da Impostazioni › Accedi con Google, con la sua Gmail.
