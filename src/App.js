// import logo from './logo.svg';
// import './App.css';

import React from 'react';
import { updatedState } from "./components/FetchInfo";
import { Korba, fetchKorbaData, initKorbaState } from './components/Korba';
import { Inputs, initInputState } from './components/Inputs'
import { Translation, TranslationPl } from './components/TranslationPl';

const translation = new Translation(TranslationPl);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleKorbaInput = this.handleKorbaInput.bind(this)
        this.updateInputState = this.updateInputState.bind(this)
        const allSources = {
            korba: {
                fetch: {
                    orth: this.handleKorbaInput,
                    base: this.handleKorbaInput
                }
            },
            sXVII: {},
            cbdu: {},
            kartoteka: {}
        }
        const allFetchTypes = ["orth", "base"]
        this.state = {
            korba: initKorbaState(),
            inputState: initInputState(allSources),
            translation: translation,
            allSources,
            allFetchTypes
        }
    }

    handleKorbaInput(inputState) {
        fetchKorbaData(inputState, (key, fetchState) =>
                this.setState(oldState => updatedState(oldState,["korba", key], () => fetchState)))
    }

    updateInputState(inputState) {
        this.setState(oldState => updatedState(oldState, ["inputState"], () => inputState))
        for (const [key, source] of Object.entries(this.state.allSources)) {
            if (inputState.sources[key])
                source.fetch[inputState.fetchType](inputState)
        }
    }

    render() {
        return (
            <div>
                <Inputs translation={this.state.translation}
                        allSources={this.state.allSources}
                        allFetchTypes={this.state.allFetchTypes}
                        handleInput={inputState => this.updateInputState(inputState)} />
                <ConditionalKorba translation={this.state.translation} {...this.state.inputState} {...this.state.korba}/>
        </div>
    );
  }
}

function ConditionalKorba(props) {
    return (props.sources.korba && props.query) ?
        <>
            <hr />
            <Korba {...props} />
        </>
        : <></>
}

export default App;
