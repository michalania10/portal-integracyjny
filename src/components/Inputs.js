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

function validState(allSources, allSearchTypes, inputState) {
    const defaultState = initInputState(allSources)
    if (!inputState)
        return defaultState;
    let resultState = {
        query: inputState.query ? inputState.query : defaultState.query,
        searchType: allSearchTypes.includes(inputState.searchType) ? inputState.searchType : defaultState.searchType,
    }
    let resultSources = validSources(allSources, resultState.searchType, inputState.sources)
    resultState.sources = (Object.values(resultSources).filter(x => x).length === 0) ?
        allValidSources(allSources, resultState.searchType) : resultSources
    return resultState
}

const queryParamName = "q"
const searchTypeParamName = "t"
const sourceParamName = "s"

function url2inputState(urlSearchParams, allSources) {
    const query = urlSearchParams.get(queryParamName)
    const searchType = urlSearchParams.get(searchTypeParamName)
    const sources = {}
    urlSearchParams.getAll(sourceParamName).filter(s => allSources[s]).forEach(s => { sources[s] = true })
    return {
        query: query,
        searchType: searchType,
        sources: sources
    }
}

function inputState2url(inputState) {
    let sources = Object.entries(inputState.sources)
        .filter(pair => pair[1])
        .map(pair => sourceParamName + "=" + pair[0]).join("&")
    return "?" +
        queryParamName + "=" + encodeURIComponent(inputState.query) + "&" +
        searchTypeParamName + "=" + inputState.searchType +
        (sources === "" ? "" : ("&" + sources))
}

class Inputs extends React.Component {
    constructor(props) {
        super(props);
        let url = props.url ? props.url : window.location.search
        let urlSearchParams = new URLSearchParams(url)
        let urlInputState = url2inputState(urlSearchParams, props.allSources)
        this.state = validState(props.allSources, props.allSearchTypes, urlInputState)

        this.updateState = this.updateState.bind(this);
        this.updateSourceSelection = this.updateSourceSelection.bind(this);
        this.updateSearchType = this.updateSearchType.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputState = props.handleInputState
        this.handleSourceData = props.handleSourceData

        if (this.state.query !== "")
            this.performSearch()
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
        this.performSearch()
    }
    performSearch() {
        let inputState = this.prepareResult()
        if (!inputState.query || inputState.query === "") return
        inputState.queryLink = inputState2url(inputState)

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
            <input name={queryParamName} id="inputs.query"
                   onChange={event => this.updateState("query", event.target.value)}
                   value={this.state.query}/>

            <label htmlFor="inputs.searchType">
                {this.props.translation.get("inputs.searchType")}
            </label>
            <select name={searchTypeParamName} id="inputs.searchType"
                    onChange={event => this.updateSearchType(event.target.value)}
                    value={this.state.searchType}>
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
                        <input type="checkbox" name={sourceParamName} id={id} value={id}
                               disabled={!allowed}
                               checked={checked}
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