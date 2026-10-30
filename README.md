# Portfolio – Josias Marti

Persönliches Portfolio von Josias Marti mit ausgewählten Arbeiten aus Industrial Design, Produktentwicklung, Service Design, Interaction Design und eigenen Projekten.

**Live:** [https://josi.as](https://josi.as)

## Projekt und Repository

- **Website:** https://josi.as
- **Repository:** https://github.com/creisey/portfolio-preview
- **Produktiver Branch:** `main`
- **Hosting:** GitHub Pages
- **Deployment:** GitHub Actions über `.github/workflows/pages.yml`

Dieses Repository ist die Entwicklungs- und Veröffentlichungsbasis der aktuellen Website. Änderungen an `main` lösen automatisch den Deployment-Workflow aus. Das frühere Repository `creisey/portfolio` bleibt unverändert und dient nicht als Entwicklungsbasis.

## Veröffentlichung

Bei jedem Push auf `main` führt GitHub Actions die Veröffentlichung aus. Der Workflow:

1. checkt das Repository aus und richtet Node.js ein;
2. stellt PDF.js lokal bereit;
3. erzeugt die aktuelle PDF-Fassung des Lebenslaufs;
4. erstellt das GitHub-Pages-Artefakt und veröffentlicht die statische Website.

Den Status und die Protokolle findest du in der [GitHub-Actions-Übersicht](https://github.com/creisey/portfolio-preview/actions/workflows/pages.yml).

Die produktive Website ist unter [https://josi.as](https://josi.as) erreichbar. Domain- und DNS-Einstellungen werden separat bei GitHub Pages und Cloudflare verwaltet und sind nicht Bestandteil des Deployment-Workflows.

## Inhalte und Aufbau

Die Website umfasst:

- eine Projektübersicht mit eigenständigen Projekt-Detailansichten;
- Projektbeschreibungen, Bildergalerien, Videos und weiterführende Dokumente;
- Profil, Kompetenzen und beruflichen Lebenslauf;
- eine druckbare CV-Fassung als PDF;
- eine responsive Darstellung für unterschiedliche Bildschirmgrössen;
- einen lokal eingebundenen PDF.js-Viewer.

Die Projektübersicht und die redaktionell gepflegten Inhalte liegen teilweise als strukturierte JSON-Dateien vor. Die Darstellung und das Layout werden in der Website umgesetzt.

## Inhalte mit Pages CMS pflegen

[Pages CMS](https://pagescms.org/) ist als Redaktionsoberfläche für dieses Repository konfiguriert. Änderungen werden als Commits auf `main` gespeichert und lösen anschliessend das Deployment aus.

| Bereich | Datei | Zweck |
| --- | --- | --- |
| CMS-Konfiguration | `.pages.yml` | Redaktionsoberfläche und Felder |
| Projekte | `content/projects.json` | Projektübersicht und Detailinhalte |
| Homepage | `content/homepage.json` | Texte und Inhalte der Startseite |
| CMS-Anbindung | `assets/js/cms-content.js` | Einlesen und Anzeigen der CMS-Inhalte |
| Website | `index.html` | Struktur, Darstellung und weitere Seiteninhalte |

Im CMS lassen sich unter anderem Startseitentexte, Projekttitel, Beschreibungen, Kategorien, Titelbilder, Bildbeschreibungen, Detailtexte, Galerien und Ressourcen pflegen. Spezialinhalte können als HTML hinterlegt werden; dafür sind HTML-Kenntnisse erforderlich.

Neue Medien-Uploads über Pages CMS werden in `assets/uploads/` abgelegt. Bestehende, migrierte Bilder und Videos liegen lokal im Repository unter `assets/images/` und `assets/video/`.

## Medien und Dateien

Die verwendeten Portfolio-Bilder und Videos sind in dieses Repository übernommen worden. Dadurch ist die Website für diese Medien nicht mehr auf die entsprechenden Dateien im alten Repository angewiesen.

- Bilder: `assets/images/`
- Videos: `assets/video/`
- CMS-Uploads: `assets/uploads/`
- PDF.js-Dateien: `assets/pdfjs/` (werden im Deployment-Workflow bereitgestellt)

Bitte Medienpfade in den Inhaltsdateien konsistent als Website-Pfade referenzieren, beispielsweise `/assets/images/dateiname.jpg`.

## Entwicklung und Pflege

1. Repository klonen oder den aktuellen Stand von `main` holen.
2. Änderungen lokal vornehmen.
3. Geänderte Inhalte und Medien prüfen, insbesondere Bildpfade, Videos, PDF-Links und Projekt-Detailseiten.
4. Änderungen committen und nach `main` pushen.
5. Den GitHub-Actions-Lauf kontrollieren und die veröffentlichte Website unter [https://josi.as](https://josi.as) prüfen.

Vor einer Veröffentlichung insbesondere kontrollieren:

- Navigation und direkte Links auf Projekt-Detailseiten;
- Bilder, Videos und PDF-Dateien;
- Darstellung auf Mobilgeräten;
- Tastaturbedienbarkeit und Bildbeschreibungen;
- CV-Druck und PDF-Erzeugung;
- unbeabsichtigte Testinhalte oder persönliche Angaben.

## Wichtige Abgrenzung

- Änderungen an der aktuellen Website erfolgen ausschliesslich in `creisey/portfolio-preview`.
- Das frühere Repository `creisey/portfolio` wird nicht verändert.
- Die produktive Website wird über den Deployment-Workflow dieses Repositories veröffentlicht.
- DNS- und SSL-Konfiguration für `josi.as` werden separat verwaltet.
