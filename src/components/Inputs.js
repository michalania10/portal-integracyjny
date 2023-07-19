import React from 'react';
import {updatedState} from "./FetchInfo";

function initInputState(allSources) {
    return {
        query: "",
        searchType: 'base',
        sources: allValidSources(allSources, 'base') // { sourceKey: boolean - if it should be used }
    }
}

function validSources(allSources, searchType, sources) {
    let resultSources = {}
    for (const [key, source] of Object.entries(allSources))
        resultSources[key] = sources[key] && source.canSearch(searchType)
    return resultSources
}

function allValidSources(allSources, searchType) {
    return validSources(allSources, searchType, allSources)
}

// function validState(allSources, allSearchTypes, inputState) {
//     const defaultState = initInputState(allSources)
//     if (!inputState)
//         return defaultState;
//     let resultState = {
//         query: inputState.query ? inputState.query : defaultState.query,
//         searchType: (inputState.searchType && allSearchTypes[inputState.searchType]) ? inputState.searchType : defaultState.searchType,
//     }
//     let resultSources = validSources(allSources, resultState.searchType, inputState.sources)
//     resultState.sources = (Object.values(resultSources).filter(x => x).length === 0) ?
//         allValidSources(allSources, resultState.searchType) : resultSources
//     return resultState
// }

class Inputs extends React.Component {
    constructor(props) {
        super(props);
        this.state = initInputState(props.allSources)
        this.updateState = this.updateState.bind(this);
        this.updateSourceSelection = this.updateSourceSelection.bind(this);
        this.updateSearchType = this.updateSearchType.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputState = props.handleInputState
        this.handleSourceData = props.handleSourceData
    }

    updateState(field, value) {
        this.setState(oldState => updatedState(oldState, field, value))
    }

    updateSourceSelection(source, value) {
        this.setState(oldState => updatedState(oldState, ["sources", source], value))
    }

    updateSearchType(searchType) {
        this.updateState("searchType", searchType);
        this.updateState("sources", allValidSources(this.props.allSources, searchType));
    }

    prepareResult() {
        return { ...this.state }
    }

    handleSubmit(event) {
        event.preventDefault()
        let inputState = this.prepareResult()
        this.handleInputState(inputState)
        this.handleSourceData({})
        for (const [key, source] of Object.entries(this.props.allSources)) {
            if (inputState.sources[key]) {
                let stateLogic = {
                    input: () => this.prepareResult(),
                    setState: mapping => this.handleSourceData(oldSourceData => updatedState(oldSourceData, key, mapping))
                }
                source.fetchData(stateLogic)
            }
        }
    }

    render() {
        return <form onSubmit={this.handleSubmit}>
            <label htmlFor="inputs.query">
                {this.props.translation.get("inputs.query")}
            </label>
            <input name="q" id="inputs.query"
                   onChange={event => this.updateState("query", event.target.value)}
                   defaultValue={this.state.query}/>

            <label htmlFor="inputs.searchType">
                {this.props.translation.get("inputs.searchType")}
            </label>
            <select name="t" id="inputs.searchType"
                    onChange={event => this.updateSearchType(event.target.value)}
                    defaultValue={this.state.searchType}>
                {
                    this.props.allSearchTypes.map(searchType =>
                        <option key={searchType} value={searchType}>
                            {this.props.translation.get("inputs." + searchType)}
                        </option>)
                }
            </select>

            <fieldset>
                <legend>{this.props.translation.get("inputs.sources")}</legend>
                {Object.entries(this.props.allSources).map(entry => {
                    const id = entry[0];
                    const source = entry[1];
                    const allowed = source.canSearch(this.state.searchType);
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