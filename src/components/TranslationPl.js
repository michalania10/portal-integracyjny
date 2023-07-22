const TranslationPl = {
  "inputs.base": "Lemat",
  "inputs.orth": "Forma",
  "inputs.query": "Zapytanie",
  "inputs.searchType": "Rodzaj wyszukiwania",
  "inputs.sources": "Żródła do przeszukania",
  "inputs.submit": "Szukaj",
  "korba": "Korpus barokowy",
  "korba.allResults": "Wystąpienia",
  "korba.documentKey": "Skrót tekstu",
  "korba.forms.header": "Wyniki z podziałem na części mowy i formy gramatyczne",
  "korba.hit": "Rezultat",
  "korba.leftCtx": "Lewy kontekst",
  "korba.link": "Wyniki z korpusu barokowego",
  "korba.quotes.header": "Przykładowe wyniki z korpusu",
  "korba.rightCtx": "Prawy kontekst",
  "sXVII": "Słownik XVII wieku",
  "sXVII.haslo.czm": "Część mowy",
  "sXVII.haslo.additional": "Informacje dodatkowe",
  "sXVII.haslo.formy": "Inne formy",
  "sXVII.link": "Odnośnik do słownika",
  "sXVII.stan_opracowania.zalążek": "zalążek",
  "sXVII.stan_opracowania.w opracowaniu": "w opracowaniu",
  "sXVII.parentLink": "Link do nadhasła",
  "sXVII.znaczenia": "Znaczenia",
  "sXVII.znaczenia.noResults": "Hasło w opracowaniu - nie podano jeszcze definicji",
  "cbdu": "Cyfrowa Biblioteka Druków Ulotnych",
  "kartoteka": "Kartoteka",
  "loading": "Trwa ściąganie danych",
  "noResults": "Brak wyników",
  "orth": "Forma",
  "tag": "Znacznik morfosyntaktyczny",
  "frequency": "Wystąpienia",
  "link": "Link",
  "": ""
};


class Translation {
  constructor(translation) {
    this.translation = translation;
  }

  get(key) {
    const value = this.translation[key]
    return value ? value : ("missing translation:" + key)
  }
  getOrKey(key, prefix) {
    const searchKey = prefix ? (prefix + "." + key) : key
    const value = this.translation[searchKey]
    return value ? value : key
  }
}

export { Translation, TranslationPl };