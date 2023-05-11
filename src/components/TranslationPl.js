const TranslationPl = {
  "inputs.orth": "Forma",
  "inputs.base": "Lemat",
  "inputs.value": "Zapytanie",
  "inputs.sources": "Żródła do przeszukania",
  "inputs.submit": "Szukaj",
  "inputs.query": "Zapytanie",
  "korba": "Korpus barokowy",
  "korba.allResults": "Wystąpienia",
  "korba.leftCtx": "Lewy kontekst",
  "korba.hit": "Rezultat",
  "korba.rightCtx": "Prawy kontekst",
  "korba.documentKey": "Skrót tekstu",
  "korba.link": "Wyniki z korpusu barokowego",
  "sXVII": "Słownik XVII wieku",
  "sXVII.znaczenia": "Znaczenia",
  "cbdu": "Cyfrowa Biblioteka Druków Ulotnych",
  "kartoteka": "Kartoteka",
  "loading": "Trwa ściąganie danych",
  "noResults": "Brak wyników",
  "orth": "Forma",
  "tag": "Znacznik morfosyntaktyczny",
  "frequency": "Wystąpienia",
  "link": "Link",
  "search.byBases": "Po lematach znalezionych w innych źródłach",
  "": ""
};


class Translation {
  constructor(translation) {
    this.translation = translation;
  }

  get(key) {
    const value = this.translation[key] ;
    return value ? value : ("missing translation:" + key);
  }
}

export { Translation, TranslationPl };