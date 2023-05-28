// import logo from './logo.svg';
// import './App.css';

import React from 'react';
import { updatedState } from "./components/FetchInfo";
import { Inputs, initInputState } from './components/Inputs'
import { Translation, TranslationPl } from './components/TranslationPl';
import { Korba, korbaSource } from './components/Korba';
import { SXVII, sXVIIsource } from './components/SVXII'

const translation = new Translation(TranslationPl);
const korba = korbaSource()
const sXVII = sXVIIsource()

class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleInputState = this.handleInputState.bind(this)
        this.handleSourceData = this.handleSourceData.bind(this)

        let allSources = {}
        allSources[korba.key()] = korba
        allSources[sXVII.key()] = sXVII
        // {
        //     sXVII: null,
        //     cbdu: null,
        //     kartoteka: null
        // }
        const allSearchTypes = ['orth', 'base']
        this.state = this.initState(allSources, allSearchTypes)
    }

    initState(allSources, allSearchTypes) {
        return {
            inputState: initInputState(allSources),
            translation: translation,
            allSources,
            allSearchTypes,
            sourceData: {}
        }
    }

    handleInputState(inputState) {
        this.setState(oldState => updatedState(oldState, "inputState", inputState))
    }

    handleSourceData(mapping) {
        this.setState(oldState => updatedState(oldState, "sourceData", mapping))
    }

    render() {
        return (
            <div>
                <Inputs translation={this.state.translation}
                        allSources={this.state.allSources}
                        allSearchTypes={this.state.allSearchTypes}
                        handleInputState={this.handleInputState}
                        handleSourceData={this.handleSourceData} />
                <ConditionalKorba translation={this.state.translation} sourceData={this.state.sourceData}/>
                <ConditionalSXVII translation={this.state.translation} sourceData={this.state.sourceData}/>
        </div>
    );
  }
}

function ConditionalKorba(props) {
    return (props.sourceData && props.sourceData[korba.key()]) ?
        <>
            <hr />
            <Korba { ...props.sourceData[korba.key()]}
                   translation={props.translation}/>
        </>
        : <></>
}

function ConditionalSXVII(props) {
    return (props.sourceData && props.sourceData[sXVII.key()]) ?
        <>
            <hr />
            <SXVII { ...props.sourceData[sXVII.key()]} translation={props.translation}/>
        </>
        : <></>
}

export default App;