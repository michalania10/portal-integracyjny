import React from 'react';

function initInputState(allSources) {
    return {
        query: "",
        fetchType: "orth",
        sources: allValidSources(allSources, "orth"),
    }
}
function validSources(allSources, sources, fetchType) {
    const resultSources = {}
    for (const [key, source] of Object.entries(allSources)) {
        resultSources[key] = sources[key] && !!source.fetch && !!source.fetch[fetchType];
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

function validState(allSources, allFetchTypes, state) {
    const defaultState = initInputState(allSources)
    if (!state)
        return defaultState;
    const resultState = {
        query: state.query ? state.query : defaultState.query,
        fetchType: (state.fetchType && allFetchTypes.includes(state.fetchType)) ? state.fetchType : defaultState.fetchType,
    }
    resultState.sources = validSources(allSources, state.sources, resultState.fetchType);
    if (!Object.values(resultState.sources).reduce((a,b) => a || b, false))
        resultState.sources = allValidSources(allSources, resultState.fetchType)
}

class Inputs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...validState(props.allSources, props.allFetchTypes, props.state)
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
            return newState;
        })
    }

    updateFetchType(value) {
        this.updateState("fetchType", value);
        this.updateState("sources", allValidSources(this.props.allSources, value));
    }

    prepareResult() {
        return {
            query: this.state.query,
            fetchType: this.state.fetchType,
            sources: { ...this.state.sources }
        }
    }

    handleSubmit(event) {
        const inputState = this.prepareResult()
        this.props.handleInput(inputState);

        event.preventDefault();
    }

    render() {
        return <form onSubmit={this.handleSubmit}>
            <label htmlFor="inputs.query">
                {this.props.translation.get("inputs.query")}
            </label>
            <input name="q" id="inputs.query"
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
                    const sourceData = entry[1];
                    const allowed = !! (sourceData.fetch && sourceData.fetch[this.state.fetchType]);
                    const checked = !! (allowed && this.state.sources[id]);
                    return (<div key={id}>
                        <input type="checkbox" name={id} id={id}
                               disabled={!allowed}
                               checked={checked}
                               onChange={event => this.updateSource(id, event.target.checked)} />
                        <label htmlFor={id}>{this.props.translation.get(id)}</label>
                    </div>)})
                }
            </fieldset>
            <input type="submit" value={this.props.translation.get("inputs.submit")}/>
        </form>
    }
}

export { Inputs, initInputState };