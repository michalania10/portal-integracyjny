import React from 'react';
import {updatedState} from "./FetchInfo";

function initInputState(allSources) {
    return {
        query: "",
        fetchType: 'base',
        sources: allValidSources(allSources, 'base')
    }
}

function validSources(allSources, inputState) {
    let sources = {}
    for (const [key, source] of Object.entries(allSources))
        sources[key] = inputState.sources[key] && source.canSearch(inputState.fetchType)
    return sources
}

function allValidSources(allSources, fetchType) {
    return validSources(allSources, { fetchType: fetchType, sources: allSources })
}

function validState(allSources, allFetchTypes, inputState) {
    const defaultState = initInputState(allSources)
    if (!inputState)
        return defaultState;
    let resultState = {
        query: inputState.query ? inputState.query : defaultState.query,
        fetchType: (inputState.fetchType && allFetchTypes[inputState.fetchType]) ? inputState.fetchType : defaultState.fetchType,
    }
    let resultSources = validSources(allSources, { fetchType: resultState.fetchType, sources: inputState.sources})
    resultState.sources = (resultSources.length === 0) ? allValidSources(allSources, resultState.fetchType) : resultSources
    return resultState
}

class Inputs extends React.Component {
    constructor(props) {
        super(props);
        this.state = validState(props.allSources, props.allFetchTypes, props.state)
        this.updateState = this.updateState.bind(this);
        this.updateSourceSelection = this.updateSourceSelection.bind(this);
        this.updateFetchType = this.updateFetchType.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInput = props.handleInput
    }

    updateState(field, value) {
        this.setState(oldState => updatedState(oldState, field, value))
    }

    updateSourceSelection(source, value) {
        this.setState(oldState => updatedState(oldState, ["sources", source], value))
    }

    updateFetchType(fetchType) {
        this.updateState("fetchType", fetchType);
        this.updateState("sources", allValidSources(this.props.allSources, fetchType));
    }

    prepareResult() {
        return {
            query: this.state.query,
            fetchType: this.state.fetchType,
            sources: { ...this.state.sources }
        }
    }

    updateSourceData(key, valueMapping) {
        this.updateState(["sourceData", key], valueMapping)
        this.handleInput(this.state)
    }

    handleSubmit() {
        this.updateState("sourceData", {});
        let inputState = this.prepareResult()
        for (const [key, source] of Object.entries(this.props.allSources)) {
            if (inputState.sources[key]) {
                let stateLogic = {
                    input: () => this.prepareResult(),
                    setState: mapping => this.updateSourceData(key, mapping)
                }
                source.fetchData(stateLogic)
            }
        }
    }

    render() {
        return <form onSubmit={event => this.handleSubmit()}>
            <label htmlFor="inputs.query">
                {this.props.translation.get("inputs.query")}
            </label>
            <input name="q" id="inputs.query"
                   onChange={event => this.updateState("query", event.target.value)}
                   defaultValue={this.state.query}/>

            <label htmlFor="inputs.fetchType">
                {this.props.translation["inputs.fetchType"]}
            </label>
            <select name="f" id="inputs.fetchType"
                    onChange={event => this.updateFetchType(event.target.value)}
                    defaultValue={this.state.fetchType}>
                {
                    this.props.allFetchTypes.map(fetchType =>
                        <option key={fetchType} value={fetchType}>
                            {this.props.translation.get("inputs." + fetchType)}
                        </option>)
                }
            </select>

            <fieldset>
                <legend>{this.props.translation.get("inputs.sources")}</legend>
                {Object.entries(this.props.allSources).map(entry => {
                    const id = entry[0];
                    const source = entry[1];
                    const allowed = source.canSearch(this.state.fetchType);
                    const checked = !! (allowed && this.state.sources[id]);
                    return (<div key={id}>
                        <input type="checkbox" name={id} id={id}
                               disabled={!allowed}
                               defaultChecked={checked}
                               onChange={event => this.updateSourceSelection(id, event.target.checked)} />
                        <label htmlFor={id}>{this.props.translation.get(id)}</label>
                    </div>)})
                }
            </fieldset>
            <input type="submit" value={this.props.translation.get("inputs.submit")}/>
        </form>
    }
}

export { Inputs, initInputState };