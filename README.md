# Portfolio – Josias Marti

Persönliches Portfolio von Josias Marti mit ausgewählten Arbeiten aus Industrial Design, Produktentwicklung, Service Design, Interaction Design und eigenen Projekten.

**Live:** [https://josi.as](https://josi.as)

## Projekt und Repository

- **Website:** https://josi.as
- **Repository:** https://github.com/creisey/portfolio-preview
- **Produktiver Branch:** `main`
- **Hosting:** GitHub Pages
- **Deployment:** GitHub Actions über `.github/workflows/pages.yml`

Dieses Repository ist die Entwicklungs- und Veröffentlichungsbasis der aktuellen Website. Änderungen an `main` lösen automatisch den Build- und Deployment-Workflow aus. Das frühere Repository `creisey/portfolio` bleibt unverändert.

## Inhalte und Datenquellen

Pages CMS ist die Redaktionsoberfläche. Die redaktionellen Inhalte werden in JSON-Dateien gepflegt:

- `content/homepage.json`: Texte und Inhalte der Startseite
- `content/projects.json`: Projektübersicht und Projekt-Detailinhalte
- `.pages.yml`: Konfiguration der Pages-CMS-Oberfläche

Die JSON-Dateien sind die einzige Quelle für diese CMS-Inhalte. Sie werden beim Deployment in die Website integriert. Es gibt keine nachträgliche Textüberschreibung im Browser.

## Build und Veröffentlichung

Bei jedem Push auf `main` führt GitHub Actions folgende Schritte aus:

1. Repository auschecken und Node.js einrichten.
2. PDF.js für den lokalen PDF-Viewer bereitstellen.
3. Die aktuelle CV-PDF-Datei erzeugen.
4. `scripts/build-site.cjs` ausführen. Das Skript startet die Website lokal mit Playwright, lädt die CMS-JSON-Daten über die bestehende Website-Logik und speichert das fertig gerenderte HTML im Verzeichnis `dist/`.
5. Das statische Ergebnis aus `dist/` als GitHub-Pages-Artefakt veröffentlichen.

Die veröffentlichte HTML-Seite enthält die CMS-Inhalte bereits. Der Browser muss die JSON-Daten nicht mehr nachladen, um Texte und Projektinhalte anzuzeigen. Das vermeidet sichtbare Textwechsel beim Laden.

Den Status und die Protokolle findest du in der [GitHub-Actions-Übersicht](https://github.com/creisey/portfolio-preview/actions/workflows/pages.yml).

## Website-Inhalte

Die Website umfasst:

- eine Projektübersicht mit eigenständigen Projekt-Detailansichten;
- Projektbeschreibungen, Bildergalerien, Videos und weiterführende Dokumente;
- Profil, Kompetenzen und beruflichen Lebenslauf;
- eine druckbare CV-Fassung als PDF;
- eine responsive Darstellung für unterschiedliche Bildschirmgrössen;
- einen lokal eingebundenen PDF.js-Viewer.

## Pages CMS

[Pages CMS](https://pagescms.org/) ist für dieses Repository konfiguriert. Änderungen werden als Commits auf `main` gespeichert und lösen anschliessend das Deployment aus.

Im CMS lassen sich unter anderem Startseitentexte, Projekttitel, Beschreibungen, Kategorien, Titelbilder, Bildbeschreibungen, Detailtexte, Galerien und Ressourcen pflegen. Spezialinhalte können als HTML hinterlegt werden; dafür sind HTML-Kenntnisse erforderlich.

Neue Medien-Uploads über Pages CMS werden in `assets/uploads/` abgelegt. Bestehende Bilder und Videos liegen lokal im Repository:

- Bilder: `assets/images/`
- Videos: `assets/video/`
- CMS-Uploads: `assets/uploads/`
- PDF.js-Dateien: `assets/pdfjs/` (werden im Deployment-Workflow bereitgestellt)

## Entwicklung und Pflege

1. Repository klonen oder den aktuellen Stand von `main` holen.
2. Änderungen lokal vornehmen.
3. Bei Änderungen an CMS-Inhalten die JSON-Dateien bearbeiten oder Pages CMS verwenden.
4. Den Build lokal mit den benötigten Node.js-Abhängigkeiten und Playwright ausführen: `NODE_PATH=/pfad/zu/node_modules node scripts/build-site.cjs`.
5. Änderungen committen und nach `main` pushen.
6. Den GitHub-Actions-Lauf kontrollieren und die veröffentlichte Website unter [https://josi.as](https://josi.as) prüfen.

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
