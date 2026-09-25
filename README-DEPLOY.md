# SafeCar Logistics – Website online nehmen

Dieses Verzeichnis ist die komplette Website. Keine Installation, kein Build, kein CMS: Dateien hochladen, fertig.

## Inhalt

```
index.html                          Startseite (Hauptseite mit Lead-Formular)
sportwagen-transport/               Landingpage „Sportwagen-Transport“
oldtimer-transport/                 Landingpage „Oldtimer-Transport“
fahrzeugueberfuehrung-autohaus/     Landingpage „Fahrzeugüberführung für Autohäuser“
impressum/  datenschutz/  agb/      Rechtliches (Platzhalter ersetzen, AGB vom Anwalt prüfen lassen)
404.html                            Fehlerseite
assets/config.js                    ← EINZIGE Datei, die du anpassen musst
assets/styles.css, main.js          Design und Formularlogik
assets/og-image.png, favicon.svg    Vorschaubild für Social Media, Browser-Icon
manifest.webmanifest                Web-App-Manifest (Icon/Farbe auf dem Handy-Homescreen)
sitemap.xml, robots.txt             für Google
CNAME, .nojekyll                    für GitHub Pages
```

## Schritt 1 – Kontaktdaten eintragen (5 Minuten)

Öffne `assets/config.js` in einem Texteditor (Windows: Editor / Notepad++, Mac: TextEdit im Nur-Text-Modus) und ersetze:

- `phone` – Telefonnummer wie angezeigt, z. B. `+49 171 1234567`
- `phoneTel` – dieselbe Nummer ohne Leerzeichen, z. B. `+491711234567`
- `email` – eure Anfrage-Adresse
- `legalName` – Firmenname und Anschrift (mit `<br>` als Zeilenumbruch)
- `social` – Links zu Instagram, LinkedIn usw. (leer = Icon erscheint nicht)
- `reviews` – echte Kundenbewertungen; solange die Liste leer ist, bleibt die Bewertungs-Sektion ausgeblendet

Dann in `impressum/index.html` die eckigen Klammern ersetzen (USt-ID, GüKG-Erlaubnis, Verantwortlicher).

## Schritt 2a – Veröffentlichen über GitHub Pages (empfohlen, kostenlos)

1. Auf github.com anmelden → „New repository“ → Name `safecarlogistics` → Public → Create.
2. Alle Dateien aus diesem Ordner in das Repository hochladen („Add file → Upload files“, Ordnerstruktur beibehalten; Drag & Drop des ganzen Ordnerinhalts funktioniert). Commit.
3. Repository → Settings → Pages → Source: „Deploy from a branch“ → Branch `main`, Ordner `/ (root)` → Save.
4. Unter „Custom domain“ `safecarlogistics.de` eintragen → Save. (Die Datei `CNAME` liegt bereits bei.)
5. Haken bei „Enforce HTTPS“ setzen, sobald er verfügbar ist (kann bis zu 24 h dauern, nachdem DNS gesetzt ist).

### DNS bei IONOS einstellen

IONOS → Domains & SSL → safecarlogistics.de → DNS. Bestehende A-/AAAA-/CNAME-Einträge für `@` und `www` löschen, dann anlegen:

| Typ   | Hostname | Wert                     |
|-------|----------|--------------------------|
| A     | @        | 185.199.108.153          |
| A     | @        | 185.199.109.153          |
| A     | @        | 185.199.110.153          |
| A     | @        | 185.199.111.153          |
| AAAA  | @        | 2606:50c0:8000::153      |
| AAAA  | @        | 2606:50c0:8001::153      |
| AAAA  | @        | 2606:50c0:8002::153      |
| AAAA  | @        | 2606:50c0:8003::153      |
| CNAME | www      | `DEIN-GITHUB-NAME.github.io` |

DNS braucht 10 Minuten bis einige Stunden. Danach ist die Seite unter https://safecarlogistics.de erreichbar. Achtung: Das bei IONOS mitgelieferte SSL-Zertifikat wird nicht gebraucht – GitHub stellt eines aus.

### Später etwas ändern

Datei im Repository öffnen → Stift-Symbol → bearbeiten → „Commit changes“. Nach etwa einer Minute ist die Änderung live.

## Schritt 2b – Alternative: IONOS Webspace

Wenn du ein IONOS-Hosting-Paket hast: Per SFTP (z. B. FileZilla, Zugangsdaten unter IONOS → Hosting → SFTP) alle Dateien in das Webroot-Verzeichnis hochladen. `CNAME` und `.nojekyll` können weggelassen werden. Für die schöne 404-Seite eine Datei `.htaccess` mit dem Inhalt `ErrorDocument 404 /404.html` anlegen. SSL im IONOS-Panel aktivieren.

## Schritt 3 – Formular an Notion anbinden (Make.com, kostenlos)

1. Konto auf make.com anlegen → „Create a new scenario“.
2. Modul 1: **Webhooks → Custom webhook** → Add → Name „SafeCar Website“ → Save → URL kopieren.
3. Die URL in `assets/config.js` bei `webhookUrl: ""` zwischen die Anführungszeichen einfügen, Datei hochladen (Commit).
4. Auf der Website einmal das Formular absenden – Make erkennt die Felder.
5. Modul 2: **Notion → Create a Database Item** → Datenbank „SafeCar Logistics – Leads & Anfragen“ → Felder zuordnen:
   - Anfrage ← `fahrzeug` + „ – “ + `abholort` + „ → “ + `zielort`
   - Fahrzeug, Abholort, Zielort, Name, Firma, E-Mail, Telefon, Nachricht, Kundentyp, Wunschtermin ← gleichnamige Felder
   - Bei der Schnellanfrage kommt Telefon/E-Mail gemeinsam im Feld `kontakt` → in „Telefon“ oder „Nachricht“ ablegen
   - Status ← „Neu“, Quelle ← „Website-Formular“
6. Optional Modul 3: **E-Mail → Send** an dich: „Neue Anfrage: {{fahrzeug}}“.
7. Szenario einschalten (ON). Fertig.

Ohne Webhook öffnet das Formular das E-Mail-Programm des Besuchers mit der vorausgefüllten Anfrage – funktioniert, ist aber weniger komfortabel.

## Schritt 4 – Google (am Tag der Veröffentlichung)

1. **Google Search Console** (search.google.com/search-console): Property „Domain“ → `safecarlogistics.de` → Bestätigung per TXT-Eintrag bei IONOS im DNS → danach unter „Sitemaps“ `https://safecarlogistics.de/sitemap.xml` einreichen.
2. **Google Business Profile** (business.google.com): Unternehmen anlegen, Kategorie „Fahrzeugtransportdienst“, Servicegebiet Deutschland, Website verlinken, Fotos hochladen. Das ist für lokale Suchanfragen wichtiger als jede On-Page-Optimierung.
3. In der Search Console nach 2–3 Tagen unter „Seiten“ prüfen, dass alle vier Seiten indexiert sind.

## Was für das Ranking bereits eingebaut ist

- Ein Fokus-Keyword pro Seite (Startseite: „geschlossener Fahrzeugtransport“; Landingpages: „Sportwagen Transport“, „Oldtimer Transport“, „Fahrzeugüberführung Autohaus“) in Title, H1, Meta-Description, URL und Text.
- Strukturierte Daten (Schema.org): LocalBusiness/MovingCompany, Service, FAQPage, BreadcrumbList → erhöht die Chance auf FAQ-Snippets in den Suchergebnissen.
- Canonical-Tags, Open-Graph-Bilder, Sitemap, robots.txt, saubere URLs, interne Verlinkung zwischen allen Seiten.
- Performance: kein Framework, keine externen Skripte außer Google Fonts, CSS ~14 KB, keine Cookies (kein Consent-Banner nötig).
- Mobil-optimiert, Tastatur-bedienbar, Kontrast nach WCAG AA.

## Was noch fehlt (in dieser Reihenfolge)

1. **Echte Fotos** – Transporter, Verladung, Übergabe. Als `assets/foto-*.jpg` ablegen (max. 1600 px breit, ≤ 200 KB); ich baue sie dann ein.
2. **Google-Bewertungen** – ab der ersten Bewertung binden wir sie auf der Startseite ein.
3. **Weitere Landingpages**, sobald die ersten drei ranken: „Autotransport [Stadt]“ für eure 3–5 wichtigsten Regionen, „Neuwagen Überführung“, „Fahrzeugtransport Schweiz“.
4. Optional: Google Fonts lokal hosten (datenschutzfreundlicher) – Schrift „Manrope“ als .woff2 in `assets/fonts/` legen und den `<link>` in allen Seiten durch `@font-face` ersetzen.
