import React from 'react';
import Table from "./Table";
import {FetchInfo, FetchState, fetchAndParse, updatedState} from "./FetchInfo";

const sXVIIAdress = "https://xvii-wiek.ijp.pan.pl/";

function searchUrl(base) {
    return sXVIIAdress + "ajax/json.php?elementy=haslo,znaczenia&haslo=^" + base +"$";
}

function fetchSXVIIData(base, callback) {
    fetchAndParse(searchUrl(base))
        .then(fetchState => callback(fetchState));
}

function updateSXVIIState(base) {
    return (sXVIIState, fetchState) => updatedState(sXVIIState, ["basesToFetchStates", base], fetchState)
}

function initSXVIIState() {
    return {
        basesToFetchStates: {}
    }
}

function SXVII(props) {
    return <div>
        <div><strong>{props.translation.get("sXVII")}</strong></div>
    </div>;
}

function SXVIISingle(props) {
    return <dev>
        <dev><strong>{props.base}</strong></dev>
        <dev><strong>{props.translation.get("sXVII.haslo.czm"}</strong>: {props.fetchData.haslo.czm}</dev>
        <dev><strong>{props.translation.get("sXVII.znaczenia")}</strong></dev>
        <ol>
            {props.fetchData.znaczenia.map(znaczenie => <li key={znaczenie.id_znaczenia}>{znaczenie.definicja}</li>)}
        </ol>
    </dev>;
}

