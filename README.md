# UV level at a glance 🐻‍❄️

Eine interaktive Webseite, die den aktuellen UV-Index verständlich und spielerisch visualisiert.

Die Idee entstand im Zusammenhang mit dem Thema Klimawandel und steigender UV-Belastung. Der Polarbär dient dabei als erzählerisches Element, das durch alle drei UV-Stufen führt. Je nach UV-Intensität verändert sich sein Verhalten und vermittelt die Situation auf eine intuitive Weise. Auf Desktop-Geräten erscheinen beim Hover zusätzliche Kommentare des Bären. Bei niedrigem UV-Wert kann man dem Bären ein Eis bringen, während dieses bei hoher UV-Belastung schmilzt. Dadurch entsteht eine doppelte Ebene: Einerseits wird auf den Sonnenschutz aufmerksam gemacht, andererseits verweist die Figur subtil auf die Auswirkungen steigender Temperaturen auf die Umwelt.

## Design-Überlegungen

Bei der Gestaltung war mir wichtig, komplexe UV-Daten möglichst einfach verständlich darzustellen. Farben, Illustrationen und kurze Hinweise helfen dabei, Informationen schnell zu erfassen, ohne lange Texte lesen zu müssen.

## User Experience

Ein besonderer Fokus lag auf der Nutzerfreundlichkeit. Häufig benötigte Informationen wie UV-Wert, Handlungsempfehlung und Tagesverlauf werden direkt sichtbar dargestellt, sodass Nutzerinnen und Nutzer möglichst wenige Schritte benötigen.

## Technische Erkenntnisse

Im Verlauf des Projekts konnte ich meine Kenntnisse in JavaScript, API-Anbindungen, DOM-Manipulation und responsivem Webdesign vertiefen. Besonders faszinierend fand ich die Arbeit mit APIs. Es fühlt sich fast ein bisschen wie Jedi-Magie an: Man sendet eine Anfrage an einen Server irgendwo auf der Welt und wenige Sekunden später erscheinen die aktuellen UV-Daten direkt auf der eigenen Webseite. Zu sehen, wie externe Daten in Echtzeit abgerufen, verarbeitet und visuell dargestellt werden, war einer der spannendsten Teile des Projekts.

## Funktionen

Aktueller UV-Index für beliebige Städte weltweit
Stadtsuche per Texteingabe mit Vorschlägen (auf Desktop) oder Auswahl über Stadtbuttons (auf allen Geräten)
Tagesübersicht mit Werten für Morgen, Nachmittag und Abend
Schutzempfehlungen abhängig von der UV-Stufe
Interaktive Figur als visuelle Unterstützung der Informationen
Speicherung der zuletzt ausgewählten Stadt im Browser

Künftig könnte die Anwendung um zusätzliche Funktionen erweitert werden, beispielsweise eine mehrtägige UV-Prognose, standortbasierte Wetterdaten oder personalisierte Erinnerungen zum Nachcremen.

## APIs

- [Current UV Index API](https://currentuvindex.com)
- [Open-Meteo Geocoding API](https://geocoding-api.open-meteo.com) – Wandelt Städtenamen in Koordinaten um, die anschliessend für die Abfrage der UV-Daten über die Current UV Index API genutzt werden.

## Live

https://im2.mexasugo.myhostpoint.ch

## Prozess

Es war sehr spannend, etwas so Interaktives selbst zu bauen – vieles hängt miteinander zusammen, eine Kleinigkeit beeinflusst die nächste.

Am schwierigsten war die mobile Version. Bis alles auf kleinen Bildschirmen gut aussah, hat es viele Versuche gebraucht. Auch die Drag-Interaktion für das Eis war aufwendiger als gedacht – damit der Finger auf dem Handy das Eis wirklich mitnimmt, musste ich viel recherchieren und ausprobieren.

Ein weiteres Learning: Ich habe die Website die meiste Zeit über Live Server getestet. Erst als ich die veröffentlichte Version geöffnet habe, ist mir aufgefallen, dass einige Bilder fehlen. Der Grund war einfach: Ich hatte neue Dateien erstellt, aber vergessen, sie auf den Server hochzuladen. Seitdem kontrolliere ich immer auch die Online-Version.

Was mich auch beschäftigt hat: die Karte sollte beim Laden nicht kurz den leeren Standardzustand zeigen. Ich habe sie deshalb unsichtbar gelassen und erst eingeblendet, wenn die API-Daten geladen sind – so sieht man nie "City – 00:00".

Die Animationen habe ich mit CSS und JavaScript nachgebaut, weil mir die kostenlosen Lottie-Downloads ausgegangen sind.

## Testing

Die responsive Umsetzung wurde auf einem iPhone 13 Pro (iOS 26.5), einem iPhone 14 Pro (iOS 18.4) sowie auf einem iPad der 9. Generation (iPadOS 18.7.8) getestet. Zusätzlich wurde die Website auf einem MacBook Air M1 (macOS 15.0.1) überprüft.
