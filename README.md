# Doomsong — Akty Walki

Pierwsza wersja rozszerzenia Owlbear Rodeo. MG rozpoczyna/zamyka walkę oraz zmienia fazy: Przygotowanie, Akty I–VI. Po Akcie VI wraca Przygotowanie, a licznik rund rośnie.

## Działanie
- Każdy uczestnik z zainstalowanym i włączonym rozszerzeniem widzi 2,9-sekundowe ogłoszenie po zmianie fazy. Testować w pokoju z dwiema osobami — SDK nie zapewnia pełnoekranowej nakładki niezależnej od interfejsu Owlbear.
- W trakcie walki etykieta (badge) na ikonie rozszerzenia pokazuje P albo numer aktu. Po zakończeniu znika.
- Sterowanie jest dostępne wyłącznie MG. Po otwarciu istniejącej walki rozszerzenie odczytuje aktualną fazę.
- Stan fazy jest bardzo małym obiektem zapisanym w **Scene Metadata** (nie Room Metadata). Nie zapisujemy obrazków ani dużych danych.
- Zmiana sceny oznacza osobny stan walki dla każdej sceny.

## Publikacja
1. Utwórz publiczne repozytorium GitHub o nazwie **doomsong-acts**.
2. Wgraj do głównego katalogu repozytorium wszystkie pliki projektu (w tym ukryty katalog `.github`).
3. W `Settings → Pages` wybierz `Source: GitHub Actions`.
4. Zaczekaj na zielony workflow w `Actions`.
5. Zainstaluj manifest: `https://attentionhorse1.github.io/doomsong-acts/manifest.json`.
6. Dodaj rozszerzenie do pokoju i otwórz jego ikonę w lewym górnym rogu. Spróbuj z dwóch kont.

**Uwaga:** nazwa repozytorium jest uwzględniona w `vite.config.js` i `public/manifest.json`. Jeśli wybierzesz inną nazwę, zmień ścieżki w obu plikach.

## Lokalnie
`npm install`, `npm test`, `npm run build`.

## Znane ograniczenia prototypu
- Oficjalne API nie pozwala swobodnie przykleić widżetu HTML do rogu całego ekranu. Wykorzystujemy badge na ikonie akcji.
- Ogłoszenia są niewielkimi modalami Owlbear, a nie niezależnymi nakładkami graficznymi na mapę.
- Styl jest wykonany przez CSS, bez zewnętrznych obrazków i fontów.
- Sterowanie jest zabezpieczone rolą GM po stronie klienta; rozszerzenie nie jest mechanizmem bezpieczeństwa przeciw złośliwym klientom.


## Ilustracje aktów

Pliki `public/acts/0.webp`–`6.webp` to siedem osobnych drzeworytów. Okno o szerokości 760 i wysokości 530 px pokazuje pełną grafikę bez przycinania. Pliki są statycznymi zasobami GitHub Pages, nie trafiają do metadanych Owlbear. Stan walki jest małym obiektem w **Scene Metadata** (`pl.attentionhorse1.doomsong-acts/combat`); **Room Metadata nie jest używane**.
