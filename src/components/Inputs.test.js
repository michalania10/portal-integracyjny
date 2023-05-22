import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Inputs, initInputState } from './Inputs'
import { updatedState } from "./FetchInfo";
import Source from './Source'


class MockTranslation {
    get(x) { return x; }
}

function mockSearchMethod(stateLogic) {
    stateLogic.setState(oldState => { return { ...stateLogic.input() } })
}

function timedMockSearchMethod(stateLogic) {
    window.setTimeout(() => mockSearchMethod(stateLogic), 10)
}

function TestInputs(props) {
    const translation = new MockTranslation()
    const allSources = {
        orthSource: new Source("orthSource", null, mockSearchMethod),
        baseSource: new Source("baseSource", mockSearchMethod, null)
    }
    const allSearchTypes = ["orth", "base"]
    return <Inputs translation={translation}
                   allSources={allSources}
                   allSearchTypes={allSearchTypes}
                   handleInputState={props.handleInputState}
                   handleSourceData={props.handleSourceData} />
}

it("Test inputs", () => {
    let checkData = {}
    let handleInputState = inputState => checkData.myInputState = { ...inputState }
    let handleSourceData = mapping => checkData.mySourceData = updatedState(checkData.mySourceData, "sourceData", mapping)
    render(<TestInputs handleInputState={handleInputState}
                       handleSourceData={handleSourceData} />)

    fireEvent.change(screen.getByRole("combobox", { name: "inputs.searchType"}), { target: { value: "orth" } }) //select is combobox
    expect(screen.getByRole("checkbox", { name: "orthSource"})).toBeEnabled()
    expect(screen.getByRole("checkbox", { name: "baseSource"})).toBeDisabled()
    // expect(screen.getByRole("checkbox", { name: "baseSource"})).not.toBeChecked()

    fireEvent.change(screen.getByRole("combobox", { name: "inputs.searchType"}), { target: { value: "base" } }) //select is combobox
    expect(screen.getByRole("checkbox", { name: "orthSource"})).toBeDisabled()
    // expect(screen.getByRole("checkbox", { name: "orthSource"})).not.toBeChecked()
    expect(screen.getByRole("checkbox", { name: "baseSource"})).toBeEnabled()

    console.log("bede klikal inputs.submit: ", checkData)
    fireEvent.change(screen.getByRole("textbox", { name: "inputs.query" }), { target: { value: "my-query-value" } }) //textbox is input
    expect(screen.getByRole("checkbox", { name: "baseSource"})).toBeChecked()

    fireEvent.click(screen.getByRole("button", { name: "inputs.submit" }))
    console.log("kliklem inputs.submit: ", checkData)

    expect(checkData.mySourceData.sourceData.baseSource.searchType).toBe("base")
    expect(checkData.mySourceData.sourceData.baseSource.query).toBe("my-query-value")
    expect(checkData.mySourceData.sourceData.baseSource.sources).toEqual({"baseSource": true, "orthSource": false})

    expect(checkData.myInputState.searchType).toBe("base")
    expect(checkData.myInputState.query).toBe("my-query-value")
    expect(checkData.myInputState.sources).toEqual({"baseSource": true, "orthSource": false})
})
