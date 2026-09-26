# ALL IN ONE CONSULTING GERMANY — Website

Neue, konvertierungsoptimierte One-Page-Website für
[allinone-consulting.de](https://allinone-consulting.de).
Statisches HTML/CSS/JS – kein Build-Schritt, kein Framework, keine Abhängigkeiten.

## Struktur

```
index.html            Startseite (One-Pager)
benefits.html         Mitarbeiterleistungen (Firmenwagen, Prämien, Incentives)
impressum.html        Impressum
datenschutz.html      Datenschutzrichtlinie
assets/
  css/style.css       Haupt-Stylesheet (Design-Tokens ganz oben in :root)
  css/benefits.css    Zusatz-Styles für die Benefits-Seite
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
3. **Tagline-Band** – „Eine Entscheidung. Unbegrenzte Möglichkeiten.“ als Endlosband
4. **Partnerlogos** – Vattenfall, GASAG, SWK, ARAG, Ludwig Marketing, Caruso, Tokgöz
5. **Zahlen** – 5+ / 70 / 30 / 145+ mit Zähl-Animation
6. **Über uns** – Positionierung + Bürobild
7. **Vorteile** – 6 Karten (deutschlandweit, Festanstellung, Ausbildung, …)
8. **Gründer** – Ramin Deldarbig
9. **Einblicke** – Bildergalerie aus Events und Alltag
10. **Stimmen** – 6 Mitarbeiterzitate als Endlos-Slider
11. **Bewerbung** – Hauptconversion, Formular mit Validierung
12. **Beratungsgespräch** – Zweit-Conversion für Kunden
13. **FAQ** – Einwandbehandlung
14. **Kernbotschaft** – „Dein Weg zur Spitze.“
15. **Abschluss-CTA + Footer**
16. **Sticky-CTA-Leiste** auf Mobilgeräten

## Bewerbungsformular

Das Formular ist an **Formspree** angebunden:

```js
var FORM_ENDPOINT = 'https://formspree.io/f/myezngaz';   // assets/js/main.js
var FALLBACK_MAIL = 'info@allinone-consulting.de';
```

Der Versand läuft per AJAX über den vorhandenen eigenen Code – die Bibliothek
`@formspree/ajax` wird bewusst **nicht** eingebunden. Validierung, Fehlermeldungen
pro Feld, Honeypot und Statusanzeige sind bereits implementiert; die Bibliothek
würde das doppeln und eine CDN-Abhängigkeit hinzufügen.

**Formspree-Besonderheiten im Code:**

| Feld | Zweck |
|---|---|
| `email` (klein) | Formspree setzt daraus den Antwort-Empfänger – man kann direkt aus der Benachrichtigungsmail auf die Bewerbung antworten |
| `_subject` | Betreff der Benachrichtigung: „Bewerbung über die Website: Vorname Nachname" |
| `_language` | `de` – Formspree-eigene Meldungen auf Deutsch |
| `_gotcha` | Name des Honeypot-Feldes; Formspree verwirft ausgefüllte Einträge zusätzlich serverseitig |

**Fehlerbehandlung:** Formspree begründet Ablehnungen englisch und meist
einrichtungsbedingt („Form is not active", Kontingent erschöpft). Bewerber sehen
deshalb immer eine verständliche Alternative mit Telefonnummer, die technische
Ursache landet in der Browser-Konsole. Eingaben bleiben im Formular stehen.

**Fällt `FORM_ENDPOINT` weg** (Wert leeren), öffnet das Formular wieder eine
vorausgefüllte E-Mail an `FALLBACK_MAIL`. Der Pfad bleibt als Notnagel erhalten.

## Farben & Schriften (CI)

| Token | Wert | Einsatz |
|---|---|---|
| `--lime` | `#8CFF00` | Primärfarbe, CTAs, Akzente, Icons |
| `--lime-dim` | `#6FD400` | Abgedunkelte Variante |
| `--black` | `#0B0B0B` | Grundfläche |
| `--anthrazit` | `#1A1A1A` | Abwechselnde Sektionen, Karten |
| `--grey-dark` | `#2D2D2D` | Linien, Rahmen, Raster |
| `--grey` | `#A6A6A6` | Fließtext |
| `--grey-soft` | `#7C7C7C` | Sekundärtext |
| `--white` | `#FFFFFF` | Überschriften |

Schrift: **Montserrat** (400–900) über Google Fonts. Radien bewusst kantig:
`--r: 4px` für Flächen, `--r-sm: 2px` für Buttons.

Das Logo ist ein Lockup aus SVG-Signet (Lime-Kontur) und Wortmarke
„ALL IN **ONE** / CONSULTING GERMANY“ — inline im HTML, damit es mitfärbt und
scharf bleibt. Signet einzeln: `assets/img/logo-mark.svg`, Favicon:
`assets/img/favicon.svg`. Das alte Rasterlogo liegt weiterhin unter
`assets/img/logo.png`, wird aber nicht mehr eingebunden.

## Partnerlogos

Die Leiste läuft auf schwarzem Grund, deshalb sind alle Logos als **helle,
einfarbige Silhouetten** (`#B8B8B8`) mit Transparenz hinterlegt — Originaldateien
mit weißem oder dunklem Hintergrund würden als Kästen erscheinen.

* Rasterlogos wurden freigestellt: Hintergrund entfernt, Motiv auf einheitliches
  Grau gesetzt, transparenter Rand abgeschnitten.
* Bei **ARAG** ist nicht die Fläche das Logo, sondern die dunkle Zeichnung auf der
  gelben Scheibe — dort wurde die Deckkraft aus der Dunkelheit abgeleitet, sonst
  wäre nur eine gefüllte Scheibe übrig geblieben.
* Die beiden SVGs (GASAG, Ludwig Marketing) wurden direkt in der Datei umgefärbt.

Jedes Logo hat eine eigene **optische Höhe** über `style="--h:NNpx"` am
`.logo-card`. Grund: Wortmarken und runde Marken wirken bei gleicher Boxhöhe
unterschiedlich groß. Kommt ein Logo dazu, Höhe so wählen, dass es neben den
anderen gleich stark wirkt — nicht einfach dieselbe Zahl übernehmen.

## Galerie

Die Bilder stammen vom Sommer-Event mit der SWK. Fünf Hochformate, zwei
Querformate – darauf ist das Raster ausgelegt:

| Breakpoint | Raster | Zuschnitt |
|---|---|---|
| Desktop | 3 Spalten, Querformate über 2 Spalten | 74–89 % der Bildhöhe sichtbar |
| Tablet | 2 Spalten, letztes Bild über volle Breite | 66–89 % sichtbar |
| Mobil | 1 Spalte, Zellen im Seitenverhältnis des Fotos | 100 % – gar kein Zuschnitt |

**Keine abgeschnittenen Köpfe:** `object-fit: cover` schneidet bei zu flachen
Zellen oben und unten weg – genau dort, wo die Gesichter sind. Zwei Maßnahmen
verhindern das:

1. Die Zellen sind bewusst hoch (3 Rasterreihen), damit wenig Höhe verloren geht.
2. Jedes `<figure>` trägt `style="--pos:NN%"`. Der Wert verschiebt den sichtbaren
   Ausschnitt im Bild. Kleiner Wert = mehr vom oberen Bildrand.

Die Gesichter liegen in diesen Aufnahmen bei 27–46 % der Bildhöhe, die sichtbaren
Fenster bei 5–11 % bis 82–89 %. Wird ein Foto ausgetauscht, `--pos` neu prüfen:
sitzen die Köpfe tiefer im Bild, muss der Wert steigen.

Auf Tablet läuft das letzte Bild über beide Spalten – fünf Hochformate gehen auf
zwei Spalten sonst nicht auf. Zusätzlich sorgt `grid-auto-flow: dense` dafür, dass
neben den Querformaten keine Löcher bleiben.

## Benefits-Seite

`benefits.html` listet alle Mitarbeiterleistungen auf und ist aus der
Hauptnavigation, dem Footer und über einen Button unter den Vorteilskarten
erreichbar. Aufbau: Hero, Schlagwortband, Zahlen, sechs Kategoriekarten,
Firmenwagen, Prämien, Karrierepfad, Incentive-Bilder, Komplettliste, CTA.

Der Karrierepfad hat fünf Stationen: Kundenberater → Trainer → Teamleiter →
Abteilungsleiter → Standortleiter. Kommt eine Stufe dazu, auch die Spaltenzahl in
`.path__list` und den Zähler „Stufen bis zur Standortleitung" mitziehen.

**Eigene Effekte dieser Seite:**

| Effekt | Umsetzung |
|---|---|
| Karten kippen zum Mauszeiger | `data-tilt` – die Neigung sitzt auf dem inneren Element, weil das äußere schon die Scroll-Animation transformiert |
| Auto zeichnet sich selbst | SVG-Konturen, Linienlängen misst JS per `getTotalLength()`, Animation über `stroke-dashoffset` |
| Prämien-Diagramm wächst | dieselbe Balken-Mechanik wie im Hero der Startseite |
| Karrierelinie folgt dem Scrollen | `data-draw` setzt `--p` (0…1); die Linie skaliert damit, die Stationen schalten nacheinander auf `.is-on` |

Die Karrierelinie läuft auf Desktop waagerecht und kippt unter 1024 px in die
Senkrechte – fünf Stationen nebeneinander werden darunter zu schmal. Gesteuert
wird beides über dieselbe Variable, nur die Transform-Achse wechselt.

> **Inhaltlich noch offen:** Zu Firmenwagen, Prämienhöhen und Bonusstufen lagen
> keine Angaben vor. Die Texte sind deshalb bewusst ohne konkrete Zahlen,
> Fahrzeugklassen oder Schwellenwerte formuliert – auf einer Karriereseite wären
> das Zusagen an Bewerber. Die betroffenen Stellen sind in `benefits.html` als
> HTML-Kommentar `BITTE PRÜFEN` markiert.

## Scroll-Effekte & Animationen

Gesteuert über `assets/js/main.js`, gestylt im Abschnitt „ANIMATIONS-SYSTEM“ in
`style.css`. Alles greift nur, wenn `<html>` die Klasse `js` trägt — ohne
JavaScript bleibt die Seite vollständig sichtbar.

| Effekt | Auszeichnung im HTML |
|---|---|
| Einblenden beim Scrollen | `data-anim="up\|down\|left\|right\|scale\|blur\|clip\|mask"` |
| Versetzt einblenden | `data-anim-group="up"` am Container — Kinder erben Richtung und Reihenfolge |
| Überschrift Wort für Wort | `data-split` |
| Parallax | `data-parallax="0.14"` am Bild (Wert = Stärke) |
| Zahl hochzählen | `data-count="70" data-suffix="+"` |
| Endlosband | `data-marquee` am `.marquee` |

Dazu fest verdrahtet: Fortschrittsbalken oben, Header-Zustand beim Scrollen,
Ausblenden des Hero-Textes, Lime-Schein der dem Mauszeiger über den
Vorteilskarten folgt, Sticky-CTA-Leiste auf Mobilgeräten.

**Balken im Hero-Hintergrund** (`.hero__bars`, reines CSS): 16 Balken fahren beim
Laden versetzt nach oben und atmen danach in unterschiedlichem Takt weiter. Die
Höhen steigen nach rechts an – das greift die Wachstumsaussage der Headline auf.
Pro Balken steuern vier Werte im `style`-Attribut das Verhalten: `--h` Zielhöhe,
`--d` Verzögerung beim Aufbau, `--t` Dauer der Wellenbewegung, `--s` wie weit der
Balken dabei einsinkt. Aufbau und Wellenbewegung liegen bewusst auf zwei
verschachtelten Elementen, weil sich sonst beide Animationen dieselbe
`transform`-Eigenschaft überschreiben würden.

**Warum kein IntersectionObserver für die Reveals:** Bei Ankersprüngen und sehr
schnellem Scrollen kann ein Element in einem einzigen Frame von unterhalb nach
oberhalb des Viewports springen. Der Observer meldet dann nie eine Überschneidung
und der Abschnitt bliebe dauerhaft unsichtbar. Stattdessen prüft eine Abtastung in
der Scroll-Schleife die tatsächliche Position; die Liste schrumpft mit jedem
eingeblendeten Element. Dieselbe Logik sichert die Zähler ab, damit keine Zahl auf
`0` stehen bleibt.

`prefers-reduced-motion: reduce` schaltet sämtliche Effekte ab und zeigt alle
Inhalte sofort.

## Vor dem Livegang

- [ ] **Benefits-Seite:** Konditionen zum Firmenwagen (ab welcher Stufe, Fahrzeugklasse,
      Privatnutzung, Tankkarte) sowie Prämien- und Bonusdetails abstimmen und ergänzen
      – Fundstellen im Code mit `BITTE PRÜFEN` markiert
- [ ] Eine Testbewerbung abschicken – Formspree verlangt bei der ersten Übermittlung
      eine Bestätigung per E-Mail, vorher kommt nichts an
- [ ] Formspree: Vertrag zur Auftragsverarbeitung (Art. 28 DSGVO) abschließen und
      Kontingent des gebuchten Tarifs prüfen
- [ ] Cookie-Consent-Banner ergänzen (die Seite erwähnt Google-Remarketing-Pixel)
- [ ] Impressum: USt-IdNr. `DE457073094` und Steuernummer `121/5702/6169` gegenprüfen
      (die Steuernummer ist rechtlich nicht erforderlich und kann entfallen)
- [ ] Prüfen, ob Datenschutzseite und Footer ebenfalls auf die ALL IN ONE Consulting
      Germany GmbH lauten sollen – dort steht weiterhin „ALL In One Consulting /
      Ramin Deldarbig“
- [ ] Nicht mehr eingebunden, aber noch im Ordner: `event-2.jpg`, `event-3.jpg`
      (alte Galeriebilder) und `logo.png` (altes Rasterlogo) – löschen, falls nicht
      mehr gebraucht
- [ ] Impressum und Datenschutzrichtlinie anwaltlich prüfen lassen
- [ ] `og:image` und `canonical` prüfen, falls die Domain abweicht
- [ ] Tracking-Codes (Google Ads / Meta Pixel) einbauen, falls gewünscht

## Barrierefreiheit & Performance

- Semantisches HTML, Skip-Link, `aria`-Attribute an Navigation und Statusmeldungen
- Sichtbare Fokus-Ringe, Tastaturbedienung des Menüs inkl. `Escape`
- `prefers-reduced-motion` schaltet sämtliche Animationen ab
- Bilder unterhalb des Viewports mit `loading="lazy"`
- Kein Framework, keine externen Skripte – nur die Google-Fonts-Anfrage
