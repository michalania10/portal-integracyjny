import React from 'react';
import Table from './Table';
import Source from './Source'
import {FetchInfo, FetchState, fetchAndParse, updatedState} from "./FetchInfo";

const korbaAddress = "https://korba.edu.pl/"

const korbaQuotesLimit = 5
const korbaCtxLimit = 10

function korbaGetQuotesUrl(korbaQuery) {
    return korbaAddress + "api/get_quotes/" + encodeURIComponent(korbaQuery)
}

function korbaGetFormsUrl(korbaQuery) {
    return korbaAddress + "api/get_forms_for_query/" + encodeURIComponent(korbaQuery)
}

function korbaLink(korbaQuery) {
    return korbaAddress + "query_corpus_by_url/korba_full_foreign/" + encodeURIComponent(korbaQuery)
}

function fetchKorbaData(stateLogic) {
    let inputState = stateLogic.input()

    const formsQueryPart = queryPart(inputState.fetchType, inputState.query)
    const formsQuery = "[" + formsQueryPart + "]"
    let formsUrl = korbaGetFormsUrl(formsQuery)
    let quotesUrl = korbaGetQuotesUrl(formsQuery)
    stateLogic.setState({ formsFetch: FetchState.empty(formsUrl), quotesFetch: FetchState.empty(quotesUrl)})

    fetchAndParse(korbaGetFormsUrl(formsQuery))
        .then(fetchState => stateLogic.setState(oldState => updatedState(oldState, "formsFetch", fetchState)))
    fetchAndParse(korbaGetQuotesUrl(formsQuery))
        .then(fetchState => stateLogic.setState(oldState => updatedState(oldState, "quotesFetch", fetchState)))
}

function korbaSource() {
    return new Source('korba', fetchKorbaData, fetchKorbaData)
}

function escapeQuotes(string) {
    return string.replaceAll("\"", "\\\"")
}

function queryPart(attr, value) {
    return  attr + "=\"" + escapeQuotes(value) + "\""
}

function quotesQuery(formsPart, tag) {
    return "[" + formsPart + " & " + queryPart("tag", tag) + "]"
}

function Korba(props) {
    if (!props.query) return <></>

    const formsQueryPart = queryPart(props.fetchType, props.query)
    const forms = props.formsFetch.result ? props.formsFetch.result.forms : []
    const formsElem = props.formsFetch.result ?
            <KorbaForms formsQueryPart={formsQueryPart} forms={forms} translation={props.translation} /> :
            <FetchInfo {...props.formsFetch} translation={props.translation} />
    const quotes = props.quotesFetch.result ? props.quotesFetch.result.quotes : []
    const quotesElem = (forms.length === 0) ? <></> :
        (props.quotesFetch.result ? <KorbaQuotes quotes={quotes} translation={props.translation} /> :
            <FetchInfo {...props.quotesFetch} translation={props.translation} />)

    return <div>
                <h3>{props.translation.get("korba")}</h3>
                {formsElem}
                {quotesElem}
           </div>
}

function KorbaForms(props) {
    if (props.forms.length === 0)
        return <div>{props.translation.get("noResults")}</div>
    const sumResults = props.forms.map(form => form.frequency)
        .reduce((sum, current) => sum + current, 0)

    const formsWithLinks = props.forms.map(form => {
        return {
            ...form,
            key: form.orth + ":" + form.tag,
            link: (<a href={korbaLink(quotesQuery(props.formsQueryPart, form.tag))} target="blank">
                {props.translation.get("korba.link")}
            </a>)
        }
    })

    return <div>
            {props.translation.get("korba.allResults")}: {sumResults}
            <a href={korbaLink("[" + props.formsQueryPart + "]")} target="blank">
                {props.translation.get("korba.link")}
            </a>
            <Table headers={["orth", "tag", "frequency", "link"]}
                   data={formsWithLinks}
                   translation={props.translation}/>
        </div>
}

function korbaWordToObject(korbaWord) {
    const result = {}
    for (const [key, value] of korbaWord) {
        result[key] = value
    }
    return result
}

function getHit(quote) {
    return korbaWordToObject(quote.hit[quote.endPosition])
}

function createLeftContext(leftCtx, limit) {
    return Object.entries(leftCtx)
         .slice(-limit)
         .map(pair => pair[1])
         .map(korbaWordToObject)
         .map(word => word.translit)
         .join(" ")
}

function createRightContext(rightCtx, limit) {
    return Object.entries(rightCtx)
        .slice(0, limit)
        .map(pair => pair[1])
        .map(korbaWordToObject)
        .map(korbaWord => korbaWord.translit)
        .join(" ")
}

function KorbaHit(props) {
    return <>
        <strong>{props.hit.orth}</strong>
        <u>{props.hit.tag}</u>
    </>
}

function KorbaQuotes(props) {
    const limit = props.limit ? props.limit : korbaQuotesLimit
    const ctxLimit = props.ctxLimit ? props.ctxLimit : korbaCtxLimit
    const quotes = selectQuotes(props.quotes, limit)
        .map(quote => {
            return {
                "key": quote.documentKey + ":" + quote.endPosition,
                "korba.leftCtx": createLeftContext(quote.left, ctxLimit),
                "korba.hit": (<KorbaHit hit={getHit(quote)} />),
                "korba.rightCtx": createRightContext(quote.right, ctxLimit),
                "korba.documentKey": quote.documentKey
            }
        })

    return <Table headers={["korba.leftCtx", "korba.hit", "korba.rightCtx", "korba.documentKey"]}
                  data={quotes}
                  translation={props.translation}/>
}

function selectQuotes(quotes, limit) {
    let otherQuotes = []
    let quotesToCheck = quotes
    const resultQuotes = []

    while (resultQuotes.length < limit && quotesToCheck.length > 0) {
        const quotedDocuments = {}
        for (let idx = 0; idx < quotesToCheck.length && resultQuotes.length < limit; idx++) {
            const quote = quotesToCheck[idx]
            if (quotedDocuments[quote.documentKey]) {
                otherQuotes[otherQuotes.length] = quote
            } else {
                quotedDocuments[quote.documentKey] = true
                resultQuotes[resultQuotes.length] = quote
            }
        }
        quotesToCheck = otherQuotes
        otherQuotes = []
    }

    return resultQuotes
}

export { Korba, korbaSource }