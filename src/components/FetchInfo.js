import React from 'react';

class FetchState {
    constructor(url, ready, error, result) {
        this.url = url
        this.ready = ready
        this.error = error
        this.result = result
    }

    static empty(url) { return new FetchState(url, false, null, null); }
    static error(url, err) { return new FetchState(url, true, err, null); }
    static ok(url, res) { return new FetchState(url, true, null, res); }
}

function fetchAndParse(url, options) {
    return window.fetch(url, options)
        .then(res => res.json())
        .then(response => {
                console.log("Fetching response", url, response)
                return FetchState.ok(url, response)
            },
            error => {
                console.log("Fetching error", url, error)
                return FetchState.error(url, error)
            });
}

function fetchAndOtherParse(url, parse) {
    return window.fetch(url)
        .then(parse)
        .then(response => {
                console.log("Fetching response", url, response);
                return FetchState.ok(url, response);
            },
            error => {
                console.log("Fetching error", url, error);
                return FetchState.error(url, error);
            });
}

function FetchInfo(props) {
    if (!props.ready)
        return <div>{props.translation.get("loading")} {props.url}</div>
    if (props.error)
        return <div><strong>{props.error.message}</strong></div>
    return <></>;
}

function updatedStateRec(oldState, fields, pos, mapping) {
    if (pos >= fields.length) return mapping(oldState)

    let idx = fields[pos]
    let newState = !oldState ? (Number.isInteger(idx) ? [] : {})
                             : (Array.isArray(oldState) ? [...oldState] : {...oldState})

    newState[idx] = updatedStateRec(oldState ? oldState[idx] : oldState, fields, pos + 1, mapping)
    return newState
}

function updatedState(oldState, fields, valueMapping) {
    if (typeof fields === 'string' || fields instanceof String)
        fields = fields.split(".")
    else if (Number.isInteger(fields))
        fields = [fields]

    let mapping = (typeof valueMapping === 'function' || valueMapping instanceof Function) ?
        valueMapping :
        unused => valueMapping

    return updatedStateRec(oldState, fields, 0, mapping)
}

export { FetchInfo, FetchState, fetchAndParse, fetchAndOtherParse, updatedState }