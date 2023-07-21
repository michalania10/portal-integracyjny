// import logo from './logo.svg';
// import './App.css';

import React from 'react';
import { updatedState } from "./components/FetchInfo";
import { Inputs, initInputState } from './components/Inputs'
import { Translation, TranslationPl } from './components/TranslationPl';
import { Korba, korbaSource } from './components/Korba';
import { SXVII, sXVIIsource } from './components/SVXII';
import { CBDU, cbduSource } from "./components/CBDU";
import { Kartoteka, kartotekaSource } from "./components/Kartoteka";

const translation = new Translation(TranslationPl);
const korba = korbaSource()
const sXVII = sXVIIsource()
const cbdu = cbduSource()
const kartoteka = kartotekaSource()

class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleInputState = this.handleInputState.bind(this)
        this.handleSourceData = this.handleSourceData.bind(this)

        let allSources = {}
        allSources[korba.key()] = korba
        allSources[sXVII.key()] = sXVII
        allSources[cbdu.key()] = cbdu
        allSources[kartoteka.key()] = kartoteka
        // {
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
        console.log("handleInputState before", this.state)
        this.setState(oldState => updatedState(oldState, "inputState", inputState))
        console.log("handleInputState after", this.state)
    }

    handleSourceData(mapping) {
        console.log("handleSourceData before", this.state)
        this.setState(oldState => updatedState(oldState, "sourceData", mapping))
        console.log("handleSourceData after", this.state)
    }

    render() {
        return (
            <div>
                <Inputs translation={this.state.translation}
                        allSources={this.state.allSources}
                        allSearchTypes={this.state.allSearchTypes}
                        handleInputState={this.handleInputState}
                        handleSourceData={this.handleSourceData} />
                <Conditional translation={this.state.translation}
                             sourceData={this.state.sourceData} inputState={this.state.inputState}
                             fun={Korba} source={korba} />
                <Conditional translation={this.state.translation}
                             sourceData={this.state.sourceData} inputState={this.state.inputState}
                             fun={SXVII} source={sXVII} />
                <Conditional translation={this.state.translation}
                             sourceData={this.state.sourceData} inputState={this.state.inputState}
                             fun={CBDU} source={cbdu} />
                <Conditional translation={this.state.translation}
                             sourceData={this.state.sourceData} inputState={this.state.inputState}
                             fun={Kartoteka} source={kartoteka} />
        </div>
    );
  }
}

function Conditional(props) {
    if (!props.sourceData || !props.sourceData[props.source.key()] ||
        !props.inputState || !props.inputState.query) {
            return <></>
    }
    return props.fun({...props.sourceData[props.source.key()], translation: props.translation})
}

export default App;