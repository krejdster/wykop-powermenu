## Czym jest dodatek Wykop PowerMenu?

Jest to prosty skrypt `user.js`, który lekko poprawia użyteczność serwisu Wykop.pl. Przyspiesza i ułatwia korzystanie z podstawowych funkcjonalności takich jak:
- Odczytywanie nowych powiadomień z mikrobloga, wykopalisk i prywatnych wiadomości
- Odczytywanie nowych wpisów z obserwowanych tagów

Skrypt działa w wersji dziennej i nocnej.

Raczej dla wykopowych power userów ;).

---

## Instalacja

Aby zainstalować skrypt, należy wykonać kilka prostych kroków.

1. Zainstaluj dodatek pozwalający na instalację skryptów `user.js` w twojej przeglądarce.
	* Dla przeglądarki Chrome: [Tampermonkey w Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
	* Dla przeglądarki Firefox: [Tampermonkey w Firefox Add-ons](https://addons.mozilla.org/pl/firefox/addon/tampermonkey/)
	* Dla przelądarki Opera: [Tampermonkey w Opera add-ons](https://addons.opera.com/pl/extensions/details/tampermonkey-beta/)

2. Kliknij przycisk poniżej, aby zainstalować skrypt.

   [![Instaluj](https://raw.githubusercontent.com/krejdster/wykop-powermenu/master/docs/button-install.png)](https://raw.githubusercontent.com/krejdster/wykop-powermenu/master/wykop-powermenu.user.js)

**Hint:** Jeśli z jakichś powodów wolisz zainstalować skrypt manualnie, wystarczy dodać kod z pliku `wykop-powermenu.user.js` do Tampermonkey.

---

## Prezentacja

Jeśli ktoś chce zobaczyć, jak wygląda to w akcji, krótka prezentacja poniżej.

Kliknijcie w obrazek, aby przejść do serwisu YouTube.

[![Prezentacja skryptu](https://raw.githubusercontent.com/krejdster/wykop-powermenu/master/docs/youtube.png)](https://www.youtube.com/watch?v=F-jcU0g4LoA)

---

## Changelog

**Wersja 1.3 (16 marzec 2018)**

- ___Poprawka kompatybilności:___ Wykop rozdzielił powiadomienia na powiadomienia pochodzące z PW (prywatnych wiadomości) oraz na powiadomienia pochodzące ze wszystkich innych części serwisu. Kliknięcie ikonki "koperty" zostało dostosowane tak, aby sprawdzać oba typy powiadomień. Jeśli użytkownik posiada nieodczytane PW oraz inne wiadomości, najpierw zostanie pokazany użytkownikowi nieodczytana PW.
- ___Zmiana:___ kolejność przycisków została zmieniona. Wszystkie trzy przyciski pochodzące z dodatku PowerMenu znajdują się teraz obok siebie i zostały oddzielone separatorem - dzięki temu nie będą już zaburzały kolejności domyślnych przycisków Wykopu.

**Wersja 1.2 (9 maj 2017)**

- ___Poprawka kompatybilności:___ Wykop wprowadził obsługę HTTPS. Dodatek został przystosowany do tego, aby wspierać oba protokoły.


**Wersja 1.1 (30 czerwiec 2014)**

- Poprawki naprawiające kompatybilność ze zmianami na Wykopie


**Wersja 1.0 (9 czerwiec 2014)**

- Poprawki naprawiające kompatybilność ze zmianami na Wykopie
