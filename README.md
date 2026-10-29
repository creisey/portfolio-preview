# Portfolio-Konzept – Josias Marti

Dieses Repository ist die alleinige Entwicklungsbasis für das neue Portfolio. Änderungen am alten Repository `creisey/portfolio` sind nicht Teil dieses Workflows.

## Veröffentlichungsablauf

1. Änderungen und Tests erfolgen hier auf `main`.
2. GitHub Actions veröffentlicht den Stand als Vorschau.
3. Die Vorschau wird geprüft, insbesondere auf Mobilgeräten, bei Projekt-Detailseiten, Videos und PDFs.
4. Erst nach ausdrücklicher Freigabe wird die produktive Veröffentlichung von `josi.as` umgestellt.

**Wichtig:** `josi.as` bleibt bis zur Freigabe unverändert. Keine DNS- oder Produktionsumstellung ohne explizite Freigabe.

## Vorschau und Hosting

- Repository: https://github.com/creisey/portfolio-preview
- GitHub-Pages-Standardadresse: https://creisey.github.io/portfolio-preview/
- Gewünschte Vorschau-Adresse: https://preview.josi.as
- Workflow: `.github/workflows/pages.yml`

Der Workflow veröffentlicht statische Dateien aus diesem Repository über GitHub Actions. Den Status und das Ergebnis des jeweils neuesten Laufs zeigt die [GitHub-Actions-Übersicht](https://github.com/creisey/portfolio-preview/actions/workflows/pages.yml).

Die Custom-Domain `preview.josi.as` muss in den GitHub-Pages-Einstellungen dieses Repositorys hinterlegt und beim DNS-Anbieter auf `creisey.github.io` verwiesen werden. Da die Veröffentlichung über einen eigenen GitHub-Actions-Workflow erfolgt, reicht eine `CNAME`-Datei im Repository allein nicht aus. Domain- und DNS-Konfiguration müssen separat geprüft werden.

## Inhalt und bisherige Gestaltungsideen

- Eigenständige, editorial geprägte Gestaltung mit markanter Typografie, kräftigem Akzent und bewusst unregelmässigem, aber kontrolliertem Raster.
- Projektübersicht mit separaten Detailansichten und Rücknavigation.
- Projekttexte und Bildmaterial für Industrie-, Produkt-, Möbel-, Mobilitäts- und Eigenprojekte.
- Ausführlichere Darstellung von **Car Utopia** inklusive drei Videosequenzen.
- Masterarbeit **Bewegen mit Umdenken** mit Drei-Phasen-Modell und PDF.
- Profil, Kompetenzen, beruflicher Lebenslauf und druckbare CV-Fassung.
- Responsive Darstellung für kleine Bildschirme.
- Selbst gehosteter PDF.js-Viewer für die PDF-Darstellung; PDF-Generierung über den GitHub-Actions-Workflow.

## Medien und Quellen

Bestehende Bilder, Videos und Archivmaterial werden vorerst aus dem alten Repository referenziert. Das alte Repository ist dabei ausschliesslich Quelle für vorhandene Inhalte und Medien; neue Portfolio-Entwicklung findet hier statt. Falls Medien später vollständig in dieses Repository übernommen werden, sollen Pfade und Dateigrössen vor der Umstellung geprüft werden.

## Vor einer Freigabe prüfen

- [ ] Vorschau-Domain `preview.josi.as` und HTTPS funktionieren.
- [ ] Navigation und direkte Links auf Projekt-Detailseiten funktionieren.
- [ ] Alle Bilder, Videos und PDF-Dateien laden korrekt.
- [ ] CV-Druck und PDF-Erzeugung funktionieren.
- [ ] Mobile Darstellung und Tastaturbedienbarkeit sind geprüft.
- [ ] Keine Testtexte oder unbeabsichtigten persönlichen Angaben sind enthalten.
- [ ] Produktivumstellung auf `josi.as` erst nach ausdrücklicher Freigabe.
