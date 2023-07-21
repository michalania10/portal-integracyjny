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

    const formsQueryPart = queryPart(inputState.searchType, inputState.query)
    const formsQuery = "[" + formsQueryPart + "]"
    let formsUrl = korbaGetFormsUrl(formsQuery)
    let quotesUrl = korbaGetQuotesUrl(formsQuery)
    stateLogic.setState({
        formsFetch: FetchState.empty(formsUrl),
        quotesFetch: FetchState.empty(quotesUrl),
        ...inputState,
    })

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

function quotesQuery(orths, tag) {
    let escapedOrths = orths.map(orth => escapeQuotes(orth))
    let joinedOrths = escapedOrths.join("|")
    return "[" + queryPart("orth", joinedOrths) + " & " + queryPart("tag", tag) + "]"
}

function Korba(props) {
    if (!props.query) return <></>

    const formsQueryPart = queryPart(props.searchType, props.query)
    const forms = props.formsFetch.result ? props.formsFetch.result.forms : []
    const formsElem = props.formsFetch.result ?
            <KorbaForms formsQueryPart={formsQueryPart} forms={forms} translation={props.translation} /> :
            <FetchInfo {...props.formsFetch} translation={props.translation} />
    const quotes = props.quotesFetch.result ? props.quotesFetch.result.quotes : []
    const quotesElem = (forms.length === 0) ? <></> :
        <>
            <h4>{props.translation.get("korba.quotes.header")}</h4>
            {(props.quotesFetch.result ?
                <KorbaQuotes quotes={quotes} translation={props.translation} /> :
                <FetchInfo {...props.quotesFetch} translation={props.translation} />)}
        </>
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

    const lowerFormsMap = {}
    props.forms.forEach(form => {
        let lowerOrth = form.orth.toLocaleLowerCase("pl")
        let key = lowerOrth + ":" + form.tag
        let old = lowerFormsMap[key]
        if (!old) {
            lowerFormsMap[key] = {
                orth: form.orth,
                key: key,
                orths: [form.orth],
                tag: form.tag,
                frequency: form.frequency
            }
        } else {
            old.orths[old.orths.length] = form.orth
            old.frequency += form.frequency
            old.orth = lowerOrth
        }
    })
    const withLinks = Object.values(lowerFormsMap).map(lower => {
        return {
            ...lower,
            link: (<a href={korbaLink(quotesQuery(lower.orths, lower.tag))} target="blank">
                {props.translation.get("korba.link")}
            </a>)
        }
    })

    return <>
            {props.translation.get("korba.allResults")}: {sumResults}
            {' '}
            <a href={korbaLink("[" + props.formsQueryPart + "]")} target="blank">
                {props.translation.get("korba.link")}
            </a>
            <h4>{props.translation.get("korba.forms.header")}</h4>
            <Table headers={["orth", "tag", "frequency", "link"]}
                   data={withLinks}
                   translation={props.translation}/>
        </>
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
        {' '}
        <u>{props.hit.tag}</u>
    </>
}

function removeKorbaPrefix(documentKey) {
    let prefixPos = documentKey.indexOf("_")
    return documentKey.substring(prefixPos + 1) // 0 if there was no underscore
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
                "korba.documentKey": removeKorbaPrefix(quote.documentKey)
            }
        })

    return <>
            <Table headers={["korba.leftCtx", "korba.hit", "korba.rightCtx", "korba.documentKey"]}
                  data={quotes}
                  translation={props.translation}/>
        </>
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