# Korba
- Api
  - https://korba.edu.pl/api/get_forms_for_query/{URL-encoded zapytanie CQL do korpusu}
    np. http:korba.edu.pl/api/get_forms_for_query/%5Borth%3D%22Ludzie%22%5D
    które zwraca listę pasujących form wraz z ich tagsetem i liczbą wystąpień, np.:
    ```
    {
    "forms": [
      {"frequency": 446, "orth": "Ludzie", "tag": "subst:pl:nom:manim1"},
      {"frequency": 14, "orth": "Ludzie", "tag": "subst:pl:nom:manim2"},
      {"frequency": 9, "orth": "Ludzie", "tag": "subst:pl:acc:manim2"},
      {"frequency": 4, "orth": "Ludzie", "tag": "subst:pl:voc:manim1"},
      {"frequency": 1, "orth": "Ludzie", "tag": "subst:pl:voc:manim2"}]
    }
    ```
  - https://korba.edu.pl/api/get_quotes/{URL-encoded zapytanie CQL do korpusu}
    np. https://korba.edu.pl/api/get_quotes/%5Bbase%3D%22szko%C5%82a%22%5D
    które zwraca dopasowane fragmenty korpusu
- [ ] oprócz tagu morfosyntaktycznego chcemy podać bardziej “ludzką” charakterystykę gramatyczną. 
      Być może da się wyciągnąć mapowanie z API. Jeśli nie - będziemy szukać.
- [x] cytaty wyświetlają się w transkrypcji, a powinny być w transliteracji
- [x] wyświetla się pierwsze 5 przykładów, ale lepiej by było, gdyby były bardziej losowe;
      ustaliliśmy, że mają być przykłady dla różnych tagów, wtedy jest szansa,
      że będą z różnych źródeł
  - na razie z przykładów, które mam wybieram te z najbardziej różnych dokumentów
  - poprosiłem Mateusza Żółtaka o instrukcje jak dostać więcej przykładów za jednym razem
    skierował mnie do Zbigniewa Gawłowicza (napisałem), 
    który skierował mnie do dra Łukasza Kobylińskiego po dostęp - trzeba by było wystawić albo
    zmienić endpoint w serwerze korby
  - patrz niżej
- [x] liczba zwracanych przykładów to w tej chwili 10, ale może można zwiększyć to w ustawieniach APi,
  wtedy wybór będzie większy
  - no nie można
  - Mateusz nie wie, Zbigniew również nie wie
  - ** kogo mam o to spytać?**
- [x] przy cytatach nie da się wyświetlić roku - nie jest dostępny przez API
- [ ] wielkość liter przy przeszukiwaniu po formach: domyślnie nie uwzględniamy
  ale będzie przycisk “uwzględnij wielkość liter”
- [ ] pytanie: czy dla wyszukiwania po formie da się i warto dać link do słownika i do Kartoteki?  
  Czy wygląd ma być taki sam, jak dla przeszukiwania słownika, czy skrócony
  (Ola: może raczej skrócony)
  - Raczej wybór źródeł zrobię tak, żeby przy wyborze formy przeszukiwanie słownika było po lemacie
    wziętym z korby
- [ ] Zmiany 2023-07-20
  - [x] Nagłówki dla poszczególnych sesji wyników, czyli:
    - [x] przed “Forma Znacznik morfosytnaktyczny Wystąpienia”: “Wyniki z podziałem na części mowy i formy gramatyczne:”
    - [x] przed “Lewy kontekst Rezultat Prawy kontekst Skrót tekstu”: “Przykładowe wyniki z korpusu:”
  - [x] link do korpusu przy poszczególnych formach:
    ```
    [orth=”ta_konkretna_forma_z_danego_wiersza” & tag=”....”]
    ```
  - [ ] ludzka charakterystyka gramatyczna zamiast tagu na liście form
  - [x] skrót do tekstu przy cytatach: bez “KORBA_”
  - [x] przy wyświetlaniu form z KorBy prosimy spłaszczyć wielkie/małe litery na małe
  - [x] w przykładowych wynikach z korpusu między wynikiem a tagiem brakuje spacji
  - [ ] liczba wystąpień: wyrównanie do prawej
  - [x] na samej górze po liczbie wystąpień a przed linkiem brakuje spacji
# Słownik XVII wieku
- Api
  - https://xvii-wiek.ijp.pan.pl/ajax/json.php, który przyjmuje dwa parametry:
    - hasło - wyrażenie regularne opisujące wyszukiwaną formę hasłową
    - elementy - opcjonalna lista umożliwiająca ograniczenie ilości zwracanej informacji
      (pełen opis hasła SXVII jest szalenie rozbudowany).
      Możliwe elementy to formy/fleksja/etymologia/slowniki/cytaty/znaczenia/zwiazki/podhasla.
      Jeśli nie podano tego parametru, zwracane są wszystkie.
      Jeśli ma być zwróconych kilka elementów, należy je wymienić po przecinku.
      Warto wspomnieć, że ograniczenie liczby elementów znacznie przyspiesza
      czas przygotowywania odpowiedzi API.
      np. https://xvii-wiek.ijp.pan.pl/ajax/json.php?haslo=^szkoła$&elementy=znaczenia,formy
- [x] Słownik - wyświetlanie wyników mniej więcej tak jak w KorBie, ale wraz z cytatem (cytatami)
- [x] najlepiej pierwszy cytat dla każdego znaczenia (jeśli się da) 
- [x] czy da się umożliwić kliknięcie w kolejne znaczenie
  i przekierowanie od razu do tego znaczenia w Słowniku (rozwiniętego)
    - nie da sie 
- [x] Są znaczki, które oznaczają sposób wyświetlania:
    - ®kursywa® - język obcy
    - #wyzielenienie# - formy gramatyczne wyróżnione w cytatach
    - Te znaczki mają się nie wyświetlać
- [x] Zmiany 2023-07-20
  - [x] Przy wynikach z e-SXVII prosimy o link do hasła (może być tak jak w KorBie)
  - [x] Przy wynikach z e-SXVII przed wyrazem “Znaczenia” (we wcześniejszym akapicie, z numerem porządkowym)
    prosimy o podanie główki hasła wraz z ewentualną informacją, że jest to podhasło i ewentualnym numerem homonimu,
    czyli np. “BRAMA (podhasło)”, “BRAMA I”
  - [x] jeśli hasło jest “zalążkiem” lub “hasłem w opracowaniu”, to prosimy o umieszczenie tej informacji przy główce hasła
  - [x] definicje prosimy podawać w łapkach, np. “»państwo tureckie, historycznie nazywane Portą Otomańską«”
  - [x] W przypadku braku definicji w e-SXVII powinna być informacja: “hasło w opracowaniu - nie podano jeszcze definicji”

# Dwujęzyczny serwis
- [ ] Wersja angielska
- [ ] Instrukcja obsługi

# Centralna bibliteka druków ulotnych
- https://cbdu.ijp.pan.pl/cgi/search/simple?q=książę
- [ ] Zmiany 2023-07-20
  - [ ] (o ile się da) przeszukiwanie tylko w polu “transkrypcja”
    (teraz to pole nazywa się “tłumaczenie”, nie wiem, czy się da zmienić nazwę na “transkrypcja”)

# Kartoteka
- https://rcin.org.pl/dlibra/publication/20029#structure
- [ ] Jeśli nie ma to chciałbym (ja Michał) wyświetlać szufladę przed i szufladę po
  Motywacja: Szuflady mają przerwy między sobą, niech użytkownik ma możliwość zobaczenia samemu,
  dlaczego nie podajemy wyniku

# Miłoby było
- [x] Móc podać link do wyszukiwania
- [ ] Pozmieniać domyślne obrazki i napisy z create-react-app
- [ ] Przeszukiwać po wszystkim, uzupełniać wyniki wyszukiwania form i lematów o znalezione formy i lematy w innych
  źródłach (może poprzez dodania linków wyszukiwania do tego serwisu)