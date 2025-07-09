# Din Reisevenn 🧳

En AI-drevet reiseplanleggingsapp som hjelper deg med å lage personlige reiseplaner basert på dine preferanser og budsjett.

## Nye funksjoner

### 📱 PWA (Progressive Web App)
- **Installerbar**: Kan installeres som en native app på mobil og desktop
- **Offline-støtte**: Fungerer delvis offline med cached innhold
- **Push-notifikasjoner**: Motta varsler om nye reiseplaner (kommer snart)
- **Responsivt design**: Optimalisert for alle skjermstørrelser
- **App-lignende opplevelse**: Fullscreen-modus uten nettleser-UI

### 📱 Mobiloptimalisert skjema
- **Alle felt på én side**: I stedet for steg-for-steg prosess får du nå alle feltene på samme side for bedre mobilopplevelse
- **Responsivt design**: Fungerer perfekt på mobil, tablet og desktop
- **Sanntidsvalidering**: Umiddelbar tilbakemelding når du fyller ut skjemaet

### 💰 Forbedret budsjetthåndtering
- **Realistiske kostnadsestimater**: AI-en gir nå mer nøyaktige prisanslag basert på faktiske markedspriser
- **Budsjettanalyse**: Automatisk kategorisering av budsjett (lavt, moderat, høyt, luksus)
- **Tilpassede forslag**: Alle forslag tilpasses ditt spesifikke budsjett
- **Detaljerte kostnader**: Estimert kostnad for hver aktivitet og attraksjon

## API-endepunkter

### Nye endepunkter
- `POST /api/mobile-travel-form` - Komplett reiseplanlegging i ett kall
- `GET /mobile.html` - Mobiloptimalisert grensesnitt

### Eksisterende endepunkter
- `POST /api/generate-travel-suggestions` - Generer reiseforslag
- `GET /api/attractions/:location` - Hent attraksjoner
- `POST /api/bookings` - Opprett booking
- `POST /api/reviews` - Legg til anmeldelse
- `GET /api/reviews` - Hent anmeldelser

## Installasjon

### 📱 PWA Installasjon
1. Åpne `https://dinreisevenn.no/mobile.html` i nettleseren
2. Klikk på "Installer App"-knappen som vises
3. Bekreft installasjonen
4. Appen vil nå være tilgjengelig som en native app på enheten din

### 🖥️ Lokal utvikling
1. Klon repositoriet
2. Installer dependencies:
   ```bash
   npm install
   ```

3. Kopier `.env.example` til `.env` og fyll inn dine API-nøkler:
   ```bash
   cp .env.example .env
   ```

4. Generer PWA-ikoner (valgfritt):
   ```bash
   node generate-icons.js
   ```
   Åpne deretter `public/icon-generator.html` i nettleseren for å laste ned ikoner

5. Start serveren:
   ```bash
   npm start
   ```

6. Åpne `http://localhost:3000/mobile.html` for mobilgrensesnittet

## Miljøvariabler

Se `.env.example` for en fullstendig liste over nødvendige miljøvariabler.

## Budsjettvalidering

Appen validerer nå budsjett mer nøyaktig med realistiske norske priser:
- **Lavt budsjett** (< 1000 NOK per dag): Fokus på gratis aktiviteter, kollektivtransport, budsjettovernatting (hostels/camping 200-400 NOK/natt)
- **Moderat budsjett** (1000-3000 NOK per dag): Balanserte forslag med betalte attraksjoner, middels restauranter, komfortable hoteller (500-1200 NOK/natt)
- **Høyt budsjett** (3000-6000 NOK per dag): Premium opplevelser, fine restauranter (400-800 NOK/måltid), gode hoteller (1200-2500 NOK/natt)
- **Luksusbudsjett** (> 6000 NOK per dag): Luksushoteller (2500+ NOK/natt), michelin-restauranter (800-2000 NOK/måltid), private guider

### Forbedringer i budsjetthåndtering:
- **Klar budsjettforståelse**: Systemet forstår nå at budsjett er totalsum for hele reisen, ikke per dag
- **Detaljert kostnadsfordeling**: Vis fordeling mellom overnatting, mat, transport og aktiviteter
- **Realistiske norske priser**: Basert på faktiske priser i Norge 2024/2025
- **Budsjettovervåking**: Sikrer at totalkostnad ikke overstiger oppgitt budsjett

## Tekniske forbedringer

### 🔧 PWA-funksjoner
- **Service Worker**: Caching og offline-støtte
- **Web App Manifest**: Metadata for app-installasjon
- **Responsize ikoner**: Optimalisert for alle enheter og skjermstørrelser
- **Offline-deteksjon**: Intelligent håndtering av nettverksstatus
- **App Shell**: Rask lasting av grunnleggende app-struktur

### 🤖 AI og Backend
- **Forbedret prompt engineering**: Mer spesifikke instruksjoner til AI for bedre resultat
- **Budsjettvalidering middleware**: Sikrer at alle budsjett-relaterte forespørsler valideres
- **Mobiloptimalisert UI**: Responsiv design som fungerer perfekt på alle enheter
- **Bedre feilhåndtering**: Mer informative feilmeldinger og bedre brukeropplevelse

## Bruk

1. Gå til `/mobile.html` for mobiloptimalisert opplevelse
2. Fyll ut alle feltene i skjemaet
3. Få personlige reiseforslag tilpasset ditt budsjett
4. Se detaljerte kostnadsestimater for hver aktivitet

## Bidrag

Ønsker du å bidra til prosjektet? Send en pull request eller åpne en issue!

## Lisens

MIT License
