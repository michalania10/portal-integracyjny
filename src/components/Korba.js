import React from 'react';
import Table from "./Table";
import {FetchInfo, Fetch, fetchStateNotReady, hasFetch} from "./FetchInfo";

const korbaAddress = "https://korba.edu.pl/"

const korbaQuotesLimit = 5
const korbaCtxLimit = 10

function korbaGetQuotesAddress(query) {
    return korbaAddress + "api/get_quotes/" + encodeURIComponent(query);
}

function korbaGetFormsAddress(query) {
    return korbaAddress + "api/get_forms_for_query/" + encodeURIComponent(query);
}

function korbaLink(query) {
    return korbaAddress + "query_corpus_by_url/korba_full_foreign/" + encodeURIComponent(query);
}

function escapeQuotes(string) {
    return string.replaceAll("\"", "\\\"")
}

function queryPart(attr, value) {
    return  attr + "=\"" + escapeQuotes(value) + "\"";
}

function quotesQuery(formsPart, tag) {
    return "[" + formsPart + " & " + queryPart("tag", tag) + "]";
}

class Korba extends React.Component {
    constructor(props) {
        super(props);
        const formsQueryPart = queryPart(props.fetchType, props.value);
        const formsQuery = "[" + queryPart(props.fetchType, props.value) + "]";

        this.state = {
            formsFetch: fetchStateNotReady(),
            quotesFetch: fetchStateNotReady(),
            formsQueryPart,
            formsQuery,
            formsFetchUrl: korbaGetFormsAddress(formsQuery),
            quotesFetchUrl: korbaGetQuotesAddress(formsQuery)
        }

        this.formsReady = this.formsReady.bind(this);
        this.quotesReady = this.quotesReady.bind(this);
    }

    formsReady(fetchInfo) {
        this.setState((prevState) => {
            const newState = { ...prevState }
            newState.formsFetch = { ...fetchInfo };
            if (!fetchInfo.error && !fetchInfo.isLoading)
                newState.formsFetch.results = fetchInfo.results.forms;
            return newState;
        })
    }

    quotesReady(fetchInfo) {
        this.setState((prevState) => {
            const newState = { ...prevState }
            newState.quotesFetch = { ...fetchInfo };
            if (!fetchInfo.error && !fetchInfo.isLoading)
                newState.quotesFetch.results = fetchInfo.results.quotes;
            return newState;
        })
    }

    render() {
        console.log("rendering")
        const hasForms = hasFetch(this.state.formsFetch)
        const stateAndProps = { ...this.state, ...this.props }
        const formsElem = hasForms ? <KorbaForms {...stateAndProps} /> :
                <FetchInfo {...this.state.formsFetch} translation={this.props.translation} />

        const hasQuotes = hasFetch(this.state.quotesFetch)
        const quotesElem = (!hasForms) ? null :
            (hasQuotes ? <KorbaQuotes {...stateAndProps} /> :
                <FetchInfo {...this.state.quotesFetch} translation={this.props.translation}/>);

        return (
            <div>
                <Fetch url={this.state.formsFetchUrl} onResponse={this.formsReady} onError={this.formsReady} />
                <Fetch url={this.state.quotesFetchUrl} onResponse={this.quotesReady} onError={this.quotesReady} />
                <div>{this.props.translation.get("korba.korba")}</div>
                {formsElem}
                {quotesElem}
            </div>
        );
    }
}

function KorbaForms(props) {
    const forms = props.formsFetch.results
    const sumResults = forms.map(form => form.frequency)
        .reduce((sum, current) => sum + current, 0);

    const formsWithLinks = forms.map(form => {
        return {
            ...form,
            key: form.tag,
            link: (<a href={korbaLink(quotesQuery(props.formsQueryPart, form.tag))} target="blank">
                {props.translation.get("korba.link")}
            </a>)
        };
    });

    return (<div>
            {props.translation.get("korba.allResults")}: {sumResults}
            <a href={korbaLink(props.formsQuery)} target="blank">
                {props.translation.get("korba.link")}
            </a>
            <Table headers={["orth", "tag", "frequency", "link"]}
                   data={formsWithLinks}
                   translation={props.translation}/>
        </div>
    )
}

function getOrth(korbaWord) {
    return korbaWord[0][1];
}

function getTag(korbaWord) {
    return korbaWord[2][1];
}

function getHit(quote) {
    return quote.hit[quote.endPosition];
}

function createLeftContext(leftCtx, limit) {
    return Object.entries(leftCtx)
         .slice(-limit)
         .map(pair => pair[1])
         .map(getOrth)
         .join(" ")
}

function createRightContext(rightCtx, limit) {
    return Object.entries(rightCtx)
        .slice(0, limit)
        .map(pair => pair[1])
        .map(getOrth)
        .join(" ")
}

function KorbaHit(props) {
    const hit = props.hit

    return (<>
        <strong>{getOrth(hit)}</strong>
        <u>{getTag(hit)}</u>
    </>);
}

function KorbaQuotes(props) {
    const limit = props.limit ? props.limit : korbaQuotesLimit
    const ctxLimit = props.ctxLimit ? props.ctxLimit : korbaCtxLimit;
    const quotes = props.quotesFetch.results.slice(0, limit)
        .map(quote => {
            return {
                "korba.leftCtx": createLeftContext(quote.left, ctxLimit),
                "korba.hit": (<KorbaHit hit={getHit(quote)} />),
                "korba.rightCtx": createRightContext(quote.right, ctxLimit),
                "korba.documentKey": quote.documentKey
            };
        })

    return <Table headers={["korba.leftCtx", "korba.hit", "korba.rightCtx", "korba.documentKey"]}
                  data={quotes}
                  translation={props.translation}/>;
}

export default Korba;