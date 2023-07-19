import React from 'react';
import Source from "./Source";
import { updatedState} from "./FetchInfo";

let kartotekaIndexUrl = "https://rcin.org.pl/dlibra/publication/20029#structure"
let kartotekaLocalUrl = "/kartotekaIndex.html"

class KartotekaMappings {
    constructor(links) {
        let usedLinks = {}
        usedLinks[kartotekaIndexUrl] = true
        this.mappings = []

        for (let i = 0; i < links.length; i++) {
            let link = links[i]
            if (!usedLinks[link.href]) {
                usedLinks[link.href] = true
                let m = new Mapping(link)
                if (m.label.search("ROZWIĄZANIA SKRÓTÓW") === -1)
                    this.mappings[this.mappings.length] = m
                else if (m.firstMatch)
                    this.skroty = m
            }
        }

        for (let i = 0; i < this.mappings.length - 1; i++) {
            let m = this.mappings[i]
            if (!m.lastMatch) m.lastMatch = this.mappings[i + 1].firstMatch
        }

        if (this.mappings.length > 0) {
            let lastM = this.mappings[this.mappings.length - 1]
            if (lastM.lastMatch) lastM.lastMatch = "żżżżżżżżżżżżżżżż";
        }

        console.log("KartotekaMappings", this)
    }

    searchBegin(searchParam, b, e) {
        console.log("searchBegin", b, e)
        if (b >= e) return e
        let check = Math.floor((b + e) / 2)
        console.log("searchBegin", check, this.mappings[check])
        let cmp = this.mappings[check].compareString(searchParam)
        if (cmp === -1) return this.searchBegin(searchParam, b, check)
        if (cmp === 1) return this.searchBegin(searchParam,check + 1, e)
        return this.searchBegin(searchParam, b, check)
    }

    searchEnd(searchParam, b, e) {
        console.log("searchEnd", b, e)
        if (b >= e) return e
        let check = Math.floor((b + e + 1) / 2)
        console.log("searchEnd", check, this.mappings[check])
        let cmp = this.mappings[check].compareString(searchParam)
        if (cmp === -1) return this.searchEnd(searchParam, b, check - 1)
        if (cmp === 1) return this.searchEnd(searchParam, check, e)
        return this.searchEnd(searchParam, check, e)
    }

    inRange(i) {
        return i < this.mappings.length || i > 0
    }

    searchString(searchParam) {
        console.log("searchString", searchParam)
        let b = this.searchBegin(searchParam, 0, this.mappings.length)
        let e = this.searchEnd(searchParam, b, this.mappings.length - 1)

        if (this.inRange(b) || this.inRange(e)) {
            if (!this.inRange(b)) b = e
            if (!this.inRange(e)) e = b

            return this.mappings.slice(b, e + 1)
        }

        return []
    }

    searchKartoteka(searchParam) {
        searchParam = normalizeWord(searchParam)
        let result = this.searchString(searchParam)
        if (searchParam.search(/\./) !== -1)
            result[result.length] = this.skroty
        return result
    }

    ready() { return this.mappings.length > 0 }
}

let kartotekaMappings = new KartotekaMappings([])

let unwantedChars = /[^a-ząćęłńóśźż]/

function normalizeWord(word) {
    word = word.toLocaleLowerCase("pl")
    for (let unwanted = word.search(unwantedChars); unwanted !== -1; unwanted = word.search(unwantedChars)) {
        word = word.substring(0, unwanted) + word.substring(unwanted + 1)
    }
    return word
}



class Mapping {
    constructor(link) {
        this.label = link.textContent.trim()
        this.link = link.href
        let divided = this.label.split(" - ")
        let boundaries = divided.filter(word => word.length !== 0)
            .map(normalizeWord)
            .map(word => {
                let num = word.search(/[0-9]/)
                if (num === -1) return word
                return word.substring(0, num)
            })
        if (boundaries.length > 0) this.firstMatch = boundaries[0]
        if (boundaries.length > 1) this.lastMatch = boundaries[1]
    }

    compareString(searchParam) {
        if (this.lastMatch.startsWith(searchParam) ||
            this.firstMatch.startsWith(searchParam)) return 0
        if (this.firstMatch.localeCompare(searchParam, "pl") === 1) return -1
        if (this.lastMatch.localeCompare(searchParam, "pl") === -1) return 1
        return 0
    }
}

function createIndex(page) {
    let divS = page.getElementById("structure")
    let links = divS.getElementsByClassName("tab-content__tree-link")
    console.log("createIndex links")
    console.log(links)
    let usedLinks = {}
    usedLinks[kartotekaIndexUrl] = true

    return new KartotekaMappings(links)
}

function createMappings(text) {
    let page = new DOMParser().parseFromString(text, 'text/html')
    kartotekaMappings = createIndex(page)
}

function fetchMappings(url, localUrl, then) {
    console.log("Fetching kartoteka index: " + url)
    const requestOptions = {
        method: 'GET',
        headers: {
            'Accept': 'text/html',
        }
    };
    fetch(url, requestOptions)
        .then(response => response.text())
        .then(text => createMappings(text),
            error => {
                console.log("Fetching " + url + " error:" + error)
                console.log("Trying backup: " + localUrl)
                fetch(localUrl, requestOptions)
                    .then(localResponse => localResponse.text())
                    .then(text => createMappings(text),
                          error => console.log("Fetching " + localUrl + " error:" + error + " no more backups"))
                    .then(localResponse => then())
        })
        .then(response => then())
}

function searchReadyMappings(mappings, stateLogic) {
    let searchParam = stateLogic.input().query
    let searchResults = mappings.searchKartoteka(searchParam)
    stateLogic.setState(oldState => updatedState(oldState, "searchMatches", searchResults))
}

function searchKartoteka(stateLogic) {
    if (!kartotekaMappings.ready())
        fetchMappings(kartotekaIndexUrl, kartotekaLocalUrl, () => searchReadyMappings(kartotekaMappings, stateLogic))
    else
        searchReadyMappings(kartotekaMappings, stateLogic)
}

function kartotekaSource() {
    if (!kartotekaMappings.ready())
        fetchMappings(kartotekaIndexUrl, kartotekaLocalUrl, () => {})

    return new Source("kartoteka", searchKartoteka, null)
}

function Kartoteka(props) {
    if (!props.searchMatches) return <></>
   return <div>
       <h3>{props.translation.get("kartoteka")}</h3>
       <ul>
           {
               props.searchMatches.map(mapping =>
               <li key={mapping.link}>
                   <a href={mapping.link}>{mapping.label}</a>
               </li>)
           }
       </ul>
    </div>
}

export { Kartoteka, kartotekaSource }