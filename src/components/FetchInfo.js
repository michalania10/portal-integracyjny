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
class Fetch extends React.Component {
    constructor(props) {
        super(props)
        this.state = { url: null }
    }

    componentDidMount() { this.performApiCall(); }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.url !== this.state.url)
            this.performApiCall();
    }

    performApiCall() {
        console.log("Perform api call" + this.props.url)
        fetch(this.props.url)
            .then(res => res.json())
            .then(response => {
                    // console.log("Fetching response", this.props.url, response)
                    this.setState({url: this.props.url})
                    this.props.onResponse(fetchStateReady(response));
                  },
                  error => {
                    console.log("Fetching error", this.props.url, error)
                    this.props.onError(fetchStateError(error))
                  });
    }

    render() {
        console.log("Rendering fetch" + this.props.url)
        return <></>;
    }
}

function FetchInfo(props) {
    if (props.isLoading) return (
        <div>{props.translation.get("loading")}</div>
    );
    if (props.error) return (
        <div><strong>{props.error.message}</strong></div>
    );
    if (props.results != null && !props.results.length) return (
        <div>{props.translation.get("noResults")}</div>
    );
    return null;
}

export { FetchInfo, Fetch, hasFetch, fetchStateNotReady, fetchStateError, fetchStateReady }