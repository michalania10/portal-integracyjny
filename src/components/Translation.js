import React from 'react';


const translationCodeParam = "lang"

const TranslationPlData = {
  "inputs.base": "Lemat",
  "inputs.orth": "Forma",
  "inputs.query": "Zapytanie",
  "inputs.searchType": "Rodzaj wyszukiwania",
  "inputs.sources": "Żródła do przeszukania",
  "inputs.submit": "Szukaj",
  "inputs.queryLink": "Link do bierzącego wyszukiwania",
  "korba": "Korpus barokowy",
  "korba.allResults": "Wystąpienia",
  "korba.documentKey": "Skrót tekstu",
  "korba.forms.header": "Wyniki z podziałem na części mowy i formy gramatyczne",
  "korba.hit": "Rezultat",
  "korba.leftCtx": "Lewy kontekst",
  "korba.link": "Wyniki z korpusu barokowego",
  "korba.quotes.header": "Przykładowe wyniki z korpusu",
  "korba.rightCtx": "Prawy kontekst",
  "sXVII": "Słownik XVII i XVIII wieku",
  "sXVII.haslo.czm": "Część mowy",
  "sXVII.haslo.additional": "Informacje dodatkowe",
  "sXVII.haslo.formy": "Inne formy",
  "sXVII.link": "Odnośnik do słownika",
  "sXVII.stan_opracowania.zalążek": "zalążek",
  "sXVII.stan_opracowania.w opracowaniu": "w opracowaniu",
  "sXVII.stan_opracowania.opracowany": "",
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
  "": "",
  "translation.code": "pl"
}

const TranslationEnData = {
  "inputs.base": "Lemma",
  "inputs.orth": "Form",
  "inputs.query": "Query",
  "inputs.searchType": "Search type",
  "inputs.sources": "Sources to search",
  "inputs.submit": "Search",
  "inputs.queryLink": "Current search link",
  "korba": "Corpus of 17th- and 18th-century Polish Texts",
  "korba.allResults": "Results",
  "korba.documentKey": "Text ID",
  "korba.forms.header": "Results divided into parts of speech and grammatical forms",
  "korba.hit": "Result",
  "korba.leftCtx": "Left context",
  "korba.link": "Results from corpus",
  "korba.quotes.header": "Corpus result examples",
  "korba.rightCtx": "Right context",
  "sXVII": "Dictionary of the 17th- and 18th-century polish",
  "sXVII.haslo.czm": "Part of speech",
  "sXVII.haslo.additional": "Additional information",
  "sXVII.haslo.formy": "Other forms",
  "sXVII.link": "Link to the dictionary",
  "sXVII.stan_opracowania.zalążek": "Stub",
  "sXVII.stan_opracowania.w opracowaniu": "In preparation",
  "sXVII.stan_opracowania.opracowany": "",
  "sXVII.parentLink": "Parent entry",
  "sXVII.znaczenia": "Meanings",
  "sXVII.znaczenia.noResults": "Entry in preparation - no definitions yet",
  "cbdu": "Digital Library of Polish and Poland-Related News Pamphlets",
  "kartoteka": "Card index",
  "loading": "Downloading data",
  "noResults": "No results found",
  "orth": "Form",
  "tag": "Morphosyntactic tag",
  "frequency": "Frequency",
  "link": "Link",
  "": "",
  "translation.code": "en"
}

class Translation {
  constructor(translation) {
    this.translation = translation;
  }

  get(key) {
    const value = this.translation[key]
    return value ? value : ("missing translation: " + key)
  }
  getOrKey(key, prefix) {
    const searchKey = prefix ? (prefix + "." + key) : key
    const value = this.translation[searchKey]
    return value ? value : key
  }

  queryParam() {
    if (this.get("translation.code") === defaultTranslation.get("translation.code"))
      return ""
    return translationCodeParam + "=" + this.get("translation.code")
  }
}

const TranslationPl = new Translation(TranslationPlData)
const TranslationEn = new Translation(TranslationEnData)
const defaultTranslation = TranslationPl

function initTranslation() {
  let translationCode = new URLSearchParams(window.location.search).get(translationCodeParam)
  if (TranslationEn.get("translation.code") === translationCode) return TranslationEn
  if (TranslationPl.get("translation.code") === translationCode) return TranslationPl
  return defaultTranslation
}

function TranslationSelect(props) {
  return <div class="translation-select">
      <div class="header-pl">
        <img alt="Wersja polska"
             title="Wersja polska"
             src="pl.png"
             onClick={event => props.handleTranslation(TranslationPl)} />
      </div>
      <div className="header-en">
        <img alt="English version"
            title="English version"
            src="en.png"
            onClick={event => props.handleTranslation(TranslationEn)} />
      </div>
  </div>
}

export { initTranslation, TranslationSelect };