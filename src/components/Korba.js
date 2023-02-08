import React from 'react';
import Table from "./Table";
import {FetchInfo, fetchStateError, fetchStateNotReady, fetchStateReady, hasFetch} from "./FetchInfo";

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
        this.state = {
            formsFetch: fetchStateNotReady(),
            quotesFetch: fetchStateNotReady(),
            formsQueryPart: queryPart(props.fetchType, props.value),
            formsQuery: "[" + queryPart(props.fetchType, props.value) + "]",
        }
    }

    componentDidMount() {
        fetch(korbaGetFormsAddress(this.state.formsQuery))
            .then(res => res.json())
            .then(response => this.setState((prevState) => {
                    const newState = { ...prevState }
                    newState.formsFetch = fetchStateReady(response.forms);
                    return newState;
                  }),
                  error => this.setState((prevState) => {const newState = { ...prevState }
                    newState.formsFetch = fetchStateError(error);
                    return newState;
            }));
        fetch(korbaGetQuotesAddress(this.state.formsQuery))
            .then(res => res.json())
            .then(response => this.setState((prevState) => {
                    const newState = { ...prevState }
                    newState.quotesFetch = fetchStateReady(response.quotes);
                    return newState;
                }),
                error => this.setState((prevState) => {const newState = { ...prevState }
                    newState.quotesFetch = fetchStateError(error);
                    return newState;
                }));
    }

    render() {
        const hasForms = hasFetch(this.state.formsFetch)
        const stateAndProps = { ...this.state, ...this.props }
        const formsElem = hasForms ? <KorbaForms {...stateAndProps} /> :
                <FetchInfo {...this.state.formsFetch} translation={this.props.translation} />

        const hasQuotes = hasFetch(this.state.quotesFetch)
        const quotesElem = (!hasForms) ? null :
            (hasQuotes ? <KorbaQuotes {...stateAndProps} /> :
                <FetchInfo {...this.state.quotesFetch} translation={this.props.translation}/>);

        return (<div>
                <div>{this.props.translation["korba.korba"]}</div>
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
            link: (<a href={korbaLink(quotesQuery(props.formsQueryPart, form.tag))}>
                {props.translation["korba.link"]}
            </a>)
        };
    });

    return (<div>
            {props.translation["korba.allResults"]}: {sumResults}
            <a href={korbaLink(props.formsQuery)}>
                {props.translation["korba.link"]}
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

    return (<span>
        <strong>{getOrth(hit)}</strong>
        <u>{getTag(hit)}</u>
    </span>);
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