# Lumière — Studio Urody · projekt pokazowy

Fikcyjna strona salonu beauty, zbudowana jako **portfolio do zleceń stron www**.
Salon, adres, ceny i opinie są wymyślone — to celowa demonstracja pełnego zakresu
typowego zlecenia: indywidualny design, 5 podstron, RWD, animacje, galeria,
formularz, przycisk rezerwacji, SEO, szybkość ładowania.

**Podgląd na żywo:** https://sayd1975-code.github.io/lumiere/

## Zakres pokazany w projekcie

- 5 podstron: Strona główna, O nas, Oferta i cennik, Galeria, Kontakt
- Pełna responsywność (desktop / tablet / telefon), menu mobilne off-canvas
- Animacje: pojawianie się elementów przy przewijaniu (IntersectionObserver),
  efekty hover, animowany hero — z poszanowaniem `prefers-reduced-motion`
- Galeria z lightboxem (zamknięcie klawiszem Esc / kliknięciem tła)
- Formularz kontaktowy z walidacją i stanem sukcesu (demo — bez backendu)
- Przycisk rezerwacji w stylu Booksy (miejsce na widget)
- SEO: meta description, Open Graph, canonical, JSON-LD `BeautySalon`,
  sitemap.xml, robots.txt, semantyczny HTML, dostępność (skip-link, aria, focus)
- Wydajność: zero bibliotek, vanilla JS (~7 kB), jeden plik CSS,
  Service Worker z cache offline (podbij `CACHE_NAME` przy każdej zmianie!)
- PWA: `manifest.json`, ikony SVG (maskable)

## Struktura

```
index.html      — Strona główna (hero, usługi, o studiach, opinie, CTA)
o-nas.html      — historia, zespół, wartości
oferta.html     — cennik w 5 kategoriach
galeria.html    — siatka 9 kafli + lightbox
kontakt.html    — dane, godziny, formularz, Booksy
css/style.css   — design system (ivory + rose gold)
js/main.js      — interakcje (wspólny dla podstron)
sw.js           — service worker (offline)
manifest.json   — PWA
icon.svg, icon-mask.svg
robots.txt, sitemap.xml
```

## Wersja produkcyjna dla klienta — co podmienić

1. **Grafiki galerii i hero:** obecnie eleganckie SVG zastępcze. Podmień na
   zdjęcia salonu (format 4:5 lub 8:5, `.jpg`/`.webp`, 100–200 kB, z `alt`).
2. **Formularz:** podepnij wysyłkę (np. Formspree / SMTP hostingu) w
   `js/main.js` w miejscu oznaczonym komentarzem `Demo: brak backendu`.
3. **Booksy:** w `kontakt.html` podmień `href="#"` przycisku na link widgetu
   Booksy salonu.
4. **Dane:** adres, telefon, e-mail, godziny, ceny, opinie.
5. **Domena:** zaktualizuj `canonical` i OG w nagłówkach podstron.

## Aktualizacje

Przy każdej zmianie plików podbij `CACHE_NAME` w `sw.js`
(`lumiere-v1` → `lumiere-v2` itd.), inaczej odwiedzający zobaczą starą wersję.

## Licencja

Projekt pokazowy Roberta. Kod: do użytku własnego i jako portfolio.
