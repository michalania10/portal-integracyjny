import React from 'react';
import Source from './Source'
import {FetchInfo, FetchState, updatedState} from "./FetchInfo";
import cbduJsonSample from './CBDU_json_sample'

const cbduAddress = "https://cbdu.ijp.pan.pl/"

function searchUrl(form) {
    return cbduAddress +
        "cgi/search/archive/simple/export_cbdu_JSON.js?dataset=archive" +
        "&screen=Search&_action_export=1&output=JSON&" +
        "exp=" +
        encodeURIComponent("0|1|-date/creators_name/title|archive|-|q::ALL:IN:" + form + "|-|")
}

// function parseResult(result) {
//     return "I m parsing result: " + result
// }

function cbduFetchData(stateLogic) {
    let inputState = stateLogic.input()
    let fetchUrl = searchUrl(inputState.query)
    stateLogic.setState({
        formsFetch: FetchState.empty(fetchUrl)
    })

    // fetchAndParse(fetchUrl, parseResult)
    window.fetch(fetchUrl)
        .then(res => res.json())
        .then(response => {
                console.log("Fetching response", fetchUrl, response)
                return FetchState.ok(fetchUrl, response)
            },
            error => {
                console.log("Fetching error", fetchUrl, error)
                //return FetchState.error(fetchUrl, error)
                return FetchState.ok(fetchUrl, cbduJsonSample)
            })

        .then(fetchState => stateLogic.setState(oldState => updatedState(oldState, "formsFetch", fetchState)))
}

function cbduSource() {
    return new Source("cbdu", null, cbduFetchData)
}

function CBDU(props) {
    if (!props.formsFetch.result)
        return <FetchInfo {...props.formsFetch} translation={props.translation} />

    return <div>
         <ul>
             {props.formsFetch.result.map(elem =>
                 <li key={elem.eprintid}>
                     <CBDUElem elem={elem} translation={props.translation} />
                 </li>)}
         </ul>
     </div>
}

function CBDUElem(props) {
    return <div>
        {props.elem.year} <a href={props.elem.uri}>{props.elem.title}</a>
    </div>
}

export { CBDU, cbduSource }