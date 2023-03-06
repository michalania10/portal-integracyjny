# Korba
- Api
  - https://korba.edu.pl/api/get_forms_for_query/{URL-encoded zapytanie CQL do korpusu}
    np. http:korba.edu.pl/api/get_forms_for_query/%5Borth%3D%22Ludzie%22%5D
    które zwraca listę pasujących form wraz z ich tagsetem i liczbą wystąpień, np.:
    {"forms": [{"frequency": 446, "orth": "Ludzie", "tag": "subst:pl:nom:manim1"}, {"frequency": 14, "orth": "Ludzie", "tag": "subst:pl:nom:manim2"}, {"frequency": 9, "orth": "Ludzie", "tag": "subst:pl:acc:manim2"}, {"frequency": 4, "orth": "Ludzie", "tag": "subst:pl:voc:manim1"}, {"frequency": 1, "orth": "Ludzie", "tag": "subst:pl:voc:manim2"}]}
  - https://korba.edu.pl/api/get_quotes/{URL-encoded zapytanie CQL do korpusu}
    np. https://korba.edu.pl/api/get_quotes/%5Bbase%3D%22szko%C5%82a%22%5D
    które zwraca dopasowane fragmenty korpusu
- [ ] oprócz tagu morfosyntaktycznego chcemy podać bardziej “ludzką” charakterystykę gramatyczną. 
      Być może da się wyciągnąć mapowanie z API. Jeśli nie - będziemy szukać.
- [x] cytaty wyświetlają się w transkrypcji, a powinny być w transliteracji
- [ ] wyświetla się pierwsze 5 przykładów, ale lepiej by było, gdyby były bardziej losowe;
      ustaliliśmy, że mają być przykłady dla różnych tagów, wtedy jest szansa,
      że będą z różnych źródeł
  - na razie z przykładów, które mam wybieram te z najbardziej różnych dokumentów
  - poprosiłem Mateusza Żółtaka o instrukcje jak dostać więcej przykładów za jednym razem
    skierował mnie do Zbigniewa Gawłowicza (napisałem), 
    który skierował mnie do dra Łukasza Kobylińskiego po dostęp - trzeba by było wystawić albo
    zmienić endpoint w serwerze korby
- [ ] liczba zwracanych przykładów to w tej chwili 10, ale może można zwiększyć to w ustawieniach APi,
  wtedy wybór będzie większy
  - ** kogo mam o to spytać?**  
- [x] przy cytatach nie da się wyświetlić roku - nie jest dostępny przez API
- [ ] wielkość liter przy przeszukiwaniu po formach: domyślnie nie uwzględniamy
  ale będzie przycisk “uwzględnij wielkość liter”
- [ ] pytanie: czy dla wyszukiwania po formie da się i warto dać link do słownika i do Kartoteki?  
  Czy wygląd ma być taki sam, jak dla przeszukiwania słownika, czy skrócony
  (Ola: może raczej skrócony)
  - Raczej wybór źródeł zrobię tak, żeby przy wyborze formy przeszukiwanie słownika było po lemacie
    wziętym z korby
  
# Słownik XVII wieku
- Api
  - https://xvii-wiek.ijp.pan.pl/ajax/json.php, który przyjmuje dwa parametry:
    - hasło - wyrażenie regularne opisujące wyszukiwaną formę hasłową
    - elementy - opcjonalna lista umożliwiająca ograniczenie ilości zwracanej informacji (pełen opis hasła SXVII jest szalenie rozbudowany). Możliwe elementy to formy/fleksja/etymologia/slowniki/cytaty/znaczenia/zwiazki/podhasla . Jeśli nie podano tego parametru, zwracane są wszystkie. Jeśli ma być zwróconych kilka elementów, należy je wymienić po przecinku. Warto wspomnieć, że ograniczenie liczby elementów znacznie przyspiesza czas przygotowywania odpowiedzi API.
      np. https://xvii-wiek.ijp.pan.pl/ajax/json.php?haslo=^szkoła$&elementy=znaczenia,formy
- [ ] Słownik - wyświetlanie wyników mniej więcej tak jak w KorBie, ale wraz z cytatem (cytatami)
- [ ] najlepiej pierwszy cytat dla każdego znaczenia (jeśli się da) 
- [ ] czy da się umożliwić kliknięcie w kolejne znaczenie
  i przekierowanie od razu do tego znaczenia w Słowniku (rozwiniętego)

# Dwujęzyczny serwis
- [ ] Wersja angielska

# Centralna bibliteka druków ulotnych
- https://cbdu.ijp.pan.pl/cgi/search/simple?q=książę

# Kartoteka