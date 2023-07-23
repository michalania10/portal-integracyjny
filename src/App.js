// import logo from './logo.svg';
// import './App.css';

import React from 'react';
import { updatedState } from "./components/FetchInfo";
import { Inputs } from './components/Inputs'
import { initTranslation, TranslationSelect } from './components/Translation';
import { Korba, korbaSource } from './components/Korba';
import { SXVII, sXVIIsource } from './components/SVXII';
import { CBDU, cbduSource } from "./components/CBDU";
import { Kartoteka, kartotekaSource } from "./components/Kartoteka";

const korba = korbaSource()
const sXVII = sXVIIsource()
const cbdu = cbduSource()
const kartoteka = kartotekaSource()

class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleInputState = this.handleInputState.bind(this)
        this.handleSourceData = this.handleSourceData.bind(this)
        this.handleTranslation = this.handleTranslation.bind(this)

        let allSources = {}
        allSources[korba.key()] = korba
        allSources[sXVII.key()] = sXVII
        allSources[cbdu.key()] = cbdu
        allSources[kartoteka.key()] = kartoteka
        const allSearchTypes = ['orth', 'base']
        this.state = this.initState(allSources, allSearchTypes)
    }

    initState(allSources, allSearchTypes) {
        return {
            inputState: {},
            translation: initTranslation(),
            allSources,
            allSearchTypes,
            sourceData: {}
        }
    }

    handleTranslation(translation) {
        this.setState(oldState => updatedState(oldState, "translation", translation))
    }

    handleInputState(inputState) {
        this.setState(oldState => updatedState(oldState, "inputState", inputState))
    }

    handleSourceData(mapping) {
        this.setState(oldState => updatedState(oldState, "sourceData", mapping))
    }

    render() {
        return <div>
                <TranslationSelect handleTranslation={this.handleTranslation} />
                <Inputs translation={this.state.translation}
                        allSources={this.state.allSources}
                        allSearchTypes={this.state.allSearchTypes}
                        handleInputState={this.handleInputState}
                        handleSourceData={this.handleSourceData} />
                <QueryLink translation={this.state.translation} inputState={this.state.inputState} />
                <Conditional translation={this.state.translation} sourceData={this.state.sourceData}
                             fun={Korba} source={korba} />
                <Conditional translation={this.state.translation} sourceData={this.state.sourceData}
                             fun={SXVII} source={sXVII} />
                <Conditional translation={this.state.translation} sourceData={this.state.sourceData}
                             fun={CBDU} source={cbdu} />
                <Conditional translation={this.state.translation} sourceData={this.state.sourceData}
                             fun={Kartoteka} source={kartoteka} />
        </div>
  }
}

function QueryLink(props) {
    if (!props.inputState || !props.inputState.queryLink || props.inputState.queryLink === "")
        return <></>
    let translationParam = props.translation.queryParam()
    if (translationParam !== "") translationParam = translationParam + "&"
    let queryLink = "?" + translationParam + props.inputState.queryLink
    return <div><a href={queryLink}>{props.translation.get("inputs.queryLink")}</a></div>
}

function Conditional(props) {
    if (!props.sourceData || !props.sourceData[props.source.key()])
            return <></>
    return <>
        <hr/>
        <h3>{props.translation.get(props.source.key())}</h3>
        {props.fun({...props.sourceData[props.source.key()], translation: props.translation})}
    </>
}

export default App;