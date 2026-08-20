# ALL IN ONE CONSULTING GERMANY — Website

Neue, konvertierungsoptimierte One-Page-Website für
[allinone-consulting.de](https://allinone-consulting.de).
Statisches HTML/CSS/JS – kein Build-Schritt, kein Framework, keine Abhängigkeiten.

## Struktur

```
index.html            Startseite (One-Pager)
impressum.html        Impressum
datenschutz.html      Datenschutzrichtlinie
assets/
  css/style.css       Haupt-Stylesheet (Design-Tokens ganz oben in :root)
  css/legal.css       Zusatz-Styles für die Rechtstexte
  js/main.js          Navigation, Scroll-Reveal, Zähler, Marquee, Formular
  img/                alle Bilder & Partnerlogos
.claude/serve.py      kleiner lokaler Vorschau-Server
```

## Lokale Vorschau

```bash
python3 ".claude/serve.py"
```

Danach <http://localhost:5173> öffnen. (Direktes Öffnen der `index.html` per
Doppelklick funktioniert auch, nur relative Pfade sind über den Server sauberer.)

## Seitenaufbau

Der Aufbau folgt der Logik „Aufmerksamkeit → Vertrauen → Beweis → Handlung“:

1. **Topbar** – 98 %-Bewertung, Telefon, E-Mail
2. **Hero** – Claim, Nutzenversprechen, zwei CTAs, Trust-Chips, Social Proof
3. **Partnerlogos** – Vattenfall, GASAG, SWK, ARAG, Ludwig Marketing, Caruso, Tokgöz
4. **Zahlen** – 5+ / 70 / 30 / 145+ mit Zähl-Animation
5. **Über uns** – Positionierung + Bürobild
6. **Vorteile** – 6 Karten (deutschlandweit, Festanstellung, Ausbildung, …)
7. **Gründer** – Ramin Deldarbig
8. **Einblicke** – Bildergalerie aus Events und Alltag
9. **Stimmen** – 6 Mitarbeiterzitate als Endlos-Slider
10. **Bewerbung** – Hauptconversion, Formular mit Validierung
11. **Beratungsgespräch** – Zweit-Conversion für Kunden
12. **FAQ** – Einwandbehandlung
13. **Abschluss-CTA + Footer**
14. **Sticky-CTA-Leiste** auf Mobilgeräten

## Bewerbungsformular anbinden

Das Formular validiert vollständig im Browser (Pflichtfelder, E-Mail, Telefon,
Einwilligung, Honeypot gegen Spam). Für den Versand gibt es zwei Modi – gesteuert
über eine Konstante ganz oben in `assets/js/main.js`:

```js
var FORM_ENDPOINT = '';                              // leer  → Mailto-Fallback
var FALLBACK_MAIL = 'info@allinone-consulting.de';
```

* **Leer (Standard):** Es öffnet sich das E-Mail-Programm der Bewerberin bzw. des
  Bewerbers mit einer fertig ausgefüllten Nachricht. Funktioniert sofort, ohne
  Server – aber mit einem Absprungrisiko.
* **Empfohlen für den Livebetrieb:** Eine Endpoint-URL eintragen (z. B. Formspree,
  Brevo, Make/Zapier-Webhook oder ein eigenes PHP-Skript). Das Formular sendet dann
  per `POST` ein JSON mit den Feldern `Vorname`, `Nachname`, `E-Mail`, `Telefon`,
  `Motivation` und zeigt Erfolgs- bzw. Fehlermeldung direkt auf der Seite an.

## Farben & Schriften

Übernommen von der bestehenden Website:

| Token | Wert | Einsatz |
|---|---|---|
| `--green` | `#8BC644` | Primärfarbe, CTAs, Akzente |
| `--green-soft` | `#BEDA8C` | Verläufe |
| `--ink` | `#2B2A2B` | Dunkle Flächen, Text |
| `--ink-800` | `#3D4848` | Fließtext |
| `--paper` | `#F2F2F1` | Helle Sektionen |
| `--paper-2` | `#EEF0EF` | Trennflächen |

Schriften: **Epilogue** (Headlines) und **Instrument Sans** (Fließtext) – beide wie
bisher, geladen über Google Fonts.

## Partnerlogos

Alle Logos laufen einheitlich in Graustufen (`filter: grayscale(1)` in
`.logo-card img`) und sitzen in gleich großen weißen Karten, damit die Leiste ruhig
wirkt. Zwei Logos – Caruso Consulting und Enes Tokgöz – lagen nur mit fest
eingebranntem dunklem Hintergrund vor und wären als schwarze Kästen erschienen.
Sie wurden deshalb freigestellt: Hintergrund entfernt, Motiv auf einheitliches
Grau (`#4a4a4a`) gesetzt, transparenter Rand abgeschnitten.

Kommt ein neues Logo dazu, das ebenfalls einen eingebrannten Hintergrund hat, am
besten genauso freistellen – sonst fällt es aus der Reihe.

## Vor dem Livegang

- [ ] `FORM_ENDPOINT` setzen und einen Testeingang prüfen
- [ ] Cookie-Consent-Banner ergänzen (die Seite erwähnt Google-Remarketing-Pixel)
- [ ] Impressum: USt-IdNr. `DE457073094` und Steuernummer `121/5702/6169` gegenprüfen
      (die Steuernummer ist rechtlich nicht erforderlich und kann entfallen)
- [ ] Impressum und Datenschutzrichtlinie anwaltlich prüfen lassen
- [ ] `og:image` und `canonical` prüfen, falls die Domain abweicht
- [ ] Tracking-Codes (Google Ads / Meta Pixel) einbauen, falls gewünscht

## Barrierefreiheit & Performance

- Semantisches HTML, Skip-Link, `aria`-Attribute an Navigation und Statusmeldungen
- Sichtbare Fokus-Ringe, Tastaturbedienung des Menüs inkl. `Escape`
- `prefers-reduced-motion` schaltet sämtliche Animationen ab
- Bilder unterhalb des Viewports mit `loading="lazy"`
- Kein Framework, keine externen Skripte – nur die Google-Fonts-Anfrage
