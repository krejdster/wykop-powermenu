## Czym jest dodatek Wykop PowerMenu?

Jest to prosta wtyczka `user.js`, która lekko poprawia użyteczność serwisu Wykop.pl. Przyspiesza i ułatwia korzystanie z podstawowych funkcjonalności, takich jak:
- Szybkie odczytywanie nowych powiadomień z mikrobloga, wykopalisk i prywatnych wiadomości
- Szybkie odczytywanie nowych wpisów z obserwowanych tagów
- Pokazywanie 50 najnowszych wpisów z obserwowanych tagów na jednej stronie

Ponadto wtyczka dodaje trzy dodatkowe pozycje na liście rozwijalnego menu. Umożliwiają one przejście do panelu zarządzania powiadomieniami dla wybranej kategorii.

Skrypt działa w wersji dziennej i nocnej.

Nie tylko dla wykopowych power userów ;).

![Prezentacja wtyczki](https://raw.githubusercontent.com/krejdster/wykop-powermenu/master/docs/wykop-powermenu.png)

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

## Changelog


**Wersja 2.0.1 (17 marzec 2018)**

- Zamiana kolejności ikon na właściwe.


**Wersja 2.0 (17 marzec 2018)**

- ___Zmiana:___ Od teraz wtyczka nie będzie już dodawała do menu kolejnych ikonek obok istniejących. Zostają one całkowicie zastąpione przyciskami PowerMenu. Działanie przycisków pozostało bez zmian w stosunku do poprzedniej wersji.
- ___Nowość:___ W rozwijalnym menu użytkownika pojawiły się trzy dodatkowe pozycje: "wiadomości", "powiadomienia" oraz "tagi". Obok każdej z nowych pozycji widnieje także liczba reprezentująca ilość nieodczytanych powiadomień w danej sekcji. Kliknięcie odnośnika spowoduje przejście do panelu powiadomień wybranej kategorii.
- ___Usprawnienie:___ Kod dodatku został napisany od nowa. Dzięki temu wtyczka działa szybciej.


**Wersja 1.3 (16 marzec 2018)**

- ___Poprawka kompatybilności:___ Wykop rozdzielił powiadomienia na powiadomienia pochodzące z PW (prywatnych wiadomości) oraz na powiadomienia pochodzące ze wszystkich innych części serwisu. Kliknięcie ikonki "koperty" zostało dostosowane tak, aby sprawdzać oba typy powiadomień. Jeśli użytkownik posiada nieodczytane PW oraz inne wiadomości, najpierw zostanie pokazany użytkownikowi nieodczytana PW.
- ___Zmiana:___ kolejność przycisków została zmieniona. Wszystkie trzy przyciski pochodzące z dodatku PowerMenu znajdują się teraz obok siebie i zostały oddzielone separatorem - dzięki temu nie będą już zaburzały kolejności domyślnych przycisków Wykopu.


**Wersja 1.2 (9 maj 2017)**

- ___Poprawka kompatybilności:___ Wykop wprowadził obsługę HTTPS. Dodatek został przystosowany do tego, aby wspierać oba protokoły.


**Wersja 1.1 (30 czerwiec 2014)**

- Poprawki naprawiające kompatybilność ze zmianami na Wykopie


**Wersja 1.0 (9 czerwiec 2014)**

- Poprawki naprawiające kompatybilność ze zmianami na Wykopie
