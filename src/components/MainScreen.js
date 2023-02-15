import React from 'react';
import Korba from './Korba';
import { Inputs, initialState } from './Inputs'
import { Translation, TranslationPl } from './TranslationPl';

const translation = new Translation(TranslationPl);

class MainScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inputQuery: initialState(props),
            translation: translation
        }
        this.updateInputQuery.bind(this);
    }

    updateInputQuery(inputQuery) {
        console.log("new inputQuery", inputQuery)
        this.setState(oldState => {
            const newState = { ...oldState }
            newState.inputQuery = inputQuery;
            return newState;
        })
    }

    render() {
        return (
            <div>
                <Inputs translation={this.state.translation}
                        allSources={this.props.allSources}
                        allFetchTypes={this.props.allFetchTypes}
                        handleInput={inputQuery => this.updateInputQuery(inputQuery)}
                />
                <ConditionalKorba translation={this.state.translation} {...this.state.inputQuery} />
            </div>
        );
    }
}

function ConditionalKorba(props) {
    return (props.sources.korba && props.query) ?
        <>
            <hr />
            <Korba translation={props.translation}
                   fetchType={props.fetchType}
                   value={props.query} />
        </>
        : <></>
}

export default MainScreen;