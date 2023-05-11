// import logo from './logo.svg';
// import './App.css';

import React from 'react';
import { updatedState } from "./components/FetchInfo";
import { Korba, korbaSource } from './components/Korba';
import { Inputs, initInputState } from './components/Inputs'
import { Translation, TranslationPl } from './components/TranslationPl';

const translation = new Translation(TranslationPl);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleInputState = this.handleInputState.bind(this)
        let korba = korbaSource()

        let allSources = {}
        allSources[korba.key()] = korba
        // {
        //     sXVII: null,
        //     cbdu: null,
        //     kartoteka: null
        // }
        const allFetchTypes = ['orth', 'base']
        this.state = this.initState(allSources, allFetchTypes)
    }

    initState(allSources, allFetchTypes) {
        return {
            inputState: initInputState(allSources),
            translation: translation,
            allSources,
            allFetchTypes,
            sourceData: {}
        }
    }

    handleInputState(inputState) {
        this.setState(oldState => updatedState(oldState, "inputState", inputState))
    }

    render() {
        return (
            <div>
                <Inputs translation={this.state.translation}
                        allSources={this.state.allSources}
                        allFetchTypes={this.state.allFetchTypes}
                        handleInput={this.handleInputState} />
                <ConditionalKorba translation={this.state.translation} {...this.state.inputState.sourceData}/>
        </div>
    );
  }
}

function ConditionalKorba(props) {
    return (props.korba) ?
        <>
            <hr />
            <Korba {...props.korba} translation={props.translation} />
        </>
        : <></>
}

export default App;