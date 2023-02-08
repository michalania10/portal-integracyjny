import React from 'react';

function hasFetch(props) {
    return !props.isLoading && !props.error && (props.results == null || props.results.length);
}

function fetchStateNotReady() {
    return { isLoading: true, error: null, results: null }
}

function fetchStateError(error) {
    return { isLoading: false, error: error, results: null }
}

function fetchStateReady(results) {
    return { isLoading: false, error: null, results: results }
}

function FetchInfo(props) {
    if (props.isLoading) return (
        <div>{props.translation["loading"]}</div>
    );
    if (props.error) return (
        <div><strong>{props.error.message}</strong></div>
    );
    if (props.results != null && !props.results.length) return (
        <div>{props.translation["noResults"]}</div>
    );
    return null;
}

export { FetchInfo, hasFetch, fetchStateNotReady, fetchStateError, fetchStateReady }