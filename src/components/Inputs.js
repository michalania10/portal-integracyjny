import React from 'react';

function initialState(props) {
    return {
        query: "",
        fetchType: "orth",
        sources: allValidSources(props.allSources, "orth"),
    }
}


function validSources(allSources, sources, fetchType) {
    const resultSources = {}
    for (const [key, source] of Object.entries(allSources)) {
        resultSources[key] = sources[key] && source.allow[fetchType];
    }
    return resultSources;
}

function selectAllSources(allSources) {
    const resultSources = {}
    for (const key of Object.keys(allSources)) {
        resultSources[key] = true;
    }
    return resultSources;
}

function allValidSources(allSources, fetchType) {
    return validSources(allSources, selectAllSources(allSources), fetchType);
}

function validState(props, state) {
    const defaultState = initialState(props)
    if (!state)
        return defaultState;
    const resultState = {
        query: state.query ? state.query : defaultState.query,
        fetchType: (state.fetchType && props.allFetchTypes.includes(state.fetchType)) ? state.fetchType : defaultState.fetchType,
    }
    resultState.sources = validSources(props.allSources, state.sources, resultState.fetchType);
    if (!Object.values(resultState.sources).reduce((a,b) => a || b, false))
        resultState.sources = allValidSources(props.allSources, resultState.fetchType)
}

class Inputs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wasSourceUnmatched: false,
            ...validState(props, props.state)
        };
        this.updateState = this.updateState.bind(this);
        this.updateSource = this.updateSource.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateFetchType = this.updateFetchType.bind(this);
    }

    updateState(field, value) {
        this.setState(oldState => {
            const newState = {...oldState}
            newState[field] = value;
            return newState;
        })
    }

    updateSource(source, value) {
        this.setState(oldState => {
            const newState = {...oldState}
            newState.sources = {...oldState.sources}
            newState.sources[source] = value;
            if (!value)
                newState.wasSourceUnmatched = true;
            return newState;
        })
    }

    updateFetchType(value) {
        this.updateState("fetchType", value);
        if (!this.state.wasSourceUnmatched) {
            this.updateState("sources", allValidSources(this.props.allSources, value));
        }
    }

    prepareResult() {
        return {
            query: this.state.query,
            fetchType: this.state.fetchType,
            sources: { ...this.state.sources }
        }
    }

    handleSubmit(event) {
        this.props.handleInput(this.prepareResult());
        event.preventDefault();
    }

    render() {
        return <form onSubmit={this.handleSubmit}>
            <label htmlFor="inputs.query">
                {this.props.translation.get("inputs.query")}
            </label>
            <input name="v" id="inputs.query"
                   onChange={event => this.updateState("query", event.target.value)}
                   value={this.state.query}/>

            <label htmlFor="inputs.fetchType">
                {this.props.translation["inputs.fetchType"]}
            </label>
            <select name="f" id="inputs.fetchType"
                    onChange={event => this.updateFetchType(event.target.value)}
                    value={this.state.fetchType}>
                {this.props.allFetchTypes.map(fetchType =>
                    <option key={fetchType} value={fetchType}>
                        {this.props.translation.get("inputs." + fetchType)}
                    </option>)
                }
            </select>

            <fieldset>
                <legend>{this.props.translation.get("inputs.sources")}</legend>
                {Object.entries(this.props.allSources).map(entry => {
                    const id = entry[0];
                    const allowed = entry[1].allow[this.state.fetchType];
                    return (<>
                        <input type="checkbox" name={id} id={id}
                               disabled={!allowed}
                               checked={allowed && this.state.sources[id]}
                               onChange={event => this.updateSource(id, event.target.checked)} />
                        <label htmlFor={id}>{this.props.translation.get(id)}</label>
                    </>)})
                }
            </fieldset>
            <input type="submit" value={this.props.translation.get("inputs.submit")}/>
        </form>
    }
}

export { Inputs, initialState};