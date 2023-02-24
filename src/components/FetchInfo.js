import React from 'react';

class FetchState {
    constructor(ready, error, result) {
        this.ready = ready;
        this.error = error;
        this.result = result;
    }

    static empty() { return new FetchState(false, null, null); }
    static error(err) { return new FetchState(true, err, null); }
    static ok(res) { return new FetchState(true, null, res); }
}

function fetchAndParse(url) {
    return window.fetch(url)
        .then(res => res.json())
        .then(response => {
                console.log("Fetching response", url, response);
                return FetchState.ok(response);
            },
            error => {
                console.log("Fetching error", url, error);
                return FetchState.error(error);
            });
}

function FetchInfo(props) {
    if (!props.ready) return (
        <div>{props.translation.get("loading")}</div>
    );
    if (props.error) return (
        <div><strong>{props.error.message}</strong></div>
    );
    return <></>;
}

function updatedState(oldState, fields, oldToNewMapping) {
    const newState = { ...oldState }

    let toAssign = newState;
    let fieldName = fields[0];
    let oldValue = toAssign[fieldName];

    for (let fieldsIdx = 1; fieldsIdx < fields.length; fieldsIdx++) {
        toAssign[fieldName] = { ...oldValue };
        toAssign = toAssign[fieldName];

        fieldName = fields[fieldsIdx];
        oldValue = toAssign[fieldName];
    }

    toAssign[fieldName] = oldToNewMapping(oldValue)
    return newState;
}

export { FetchInfo, FetchState, fetchAndParse, updatedState }