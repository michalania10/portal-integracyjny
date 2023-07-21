import React from 'react';
import {FetchInfo, FetchState, fetchAndParse, updatedState} from "./FetchInfo";
import Source from "./Source";

const sXVIIAdress = "https://xvii-wiek.ijp.pan.pl/";

function searchUrl(base) {
    return sXVIIAdress + "ajax/json.php?elementy=haslo,znaczenia,form,cytaty&haslo=^" + encodeURIComponent(base) +"$";
}

function sXVIIlink(id_hasla) {
    return sXVIIAdress + "index.php?strona=haslo&id_hasla=" + id_hasla + "#" + id_hasla
}
function fetchSXVIIdata(stateLogic) {
    let inputState = stateLogic.input()
    let fetchUrl = searchUrl(inputState.query)
    stateLogic.setState({
        baseFetch: FetchState.empty(fetchUrl)
    })

    fetchAndParse(fetchUrl)
        .then(fetchState => stateLogic.setState(oldState => updatedState(oldState, "baseFetch", fetchState)))
}

function sXVIIsource() {
    return new Source('sXVII', fetchSXVIIdata, null)
}

function SXVII(props) {
    if (!props.baseFetch.result)
        return <FetchInfo {...props.baseFetch} translation={props.translation} />

    return <div>
        <ol>
            {props.baseFetch.result.map(elem =>
                <li key={elem.haslo.id_hasla}>
                    <SXVIIElem elem={elem} translation={props.translation} />
                </li>)}
        </ol>
    </div>;
}

function SXVIIElem(props) {
    return <>
        <SXVIIElemHaslo {...props} />
        <SXVIIElemZnaczenia {...props} />
    </>;
}

function SXVIIElemHaslo(props) {
    if (props.elem.formy && props.elem.haslo) {
        return <>
            <div>
                <strong>{props.elem.formy[0].forma}</strong>
                <a href={sXVIIlink(props.elem.haslo.id_hasla)} target="blank">{props.translation.get("sXVII.link")}</a>
            </div>
            <div><strong>{props.translation.get("sXVII.haslo.czm")}</strong>: {props.elem.haslo.czm}</div>
        </>
    }
    return <></>
}

function buildCytatyMap(cytaty) {
    const map = {}
    if (cytaty)
        for (const cytat of cytaty)
            if (cytat.typ === "znaczenia" && cytat.id_znaczenia)
                map[cytat.id_znaczenia] = cytat.cytat
    return map
}

function SXVIIElemZnaczenia(props) {
    if (props.elem.znaczenia && props.elem.znaczenia.length !== 0) {
        const cytaty = buildCytatyMap(props.elem.cytaty)
        return <>
            <div><strong>{props.translation.get("sXVII.znaczenia")}</strong></div>
            <ol>
                {props.elem.znaczenia.map(znaczenie =>
                    <li key={znaczenie.id_znaczenia}>
                        <div>{znaczenie.definicja}</div>
                        {cytaty[znaczenie.id_znaczenia] ?
                            <div><i>{cytaty[znaczenie.id_znaczenia]}</i></div> : <></>}
                    </li>)}
            </ol>
        </>
    }
    return <></>
}

export { SXVII, sXVIIsource }