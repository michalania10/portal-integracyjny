import React from 'react';
import {FetchInfo, FetchState, fetchAndParse, updatedState} from "./FetchInfo";
import Source from "./Source";

const sXVIIAdress = "https://xvii-wiek.ijp.pan.pl/";
const sXVIILinkAdress = "https://sxvii.pl/";

function searchUrl(base) {
    return sXVIIAdress + "ajax/json.php?elementy=haslo,znaczenia,formy,cytaty&haslo=^" + encodeURIComponent(base) +"$";
}

function sXVIIlink(id_hasla) {
    return sXVIILinkAdress + "index.php?strona=haslo&id_hasla=" + id_hasla
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
    if (props.baseFetch.result.length === 0)
        return <div>{props.translation.get("noResults")}</div>
    return <div>
        <ul>
            {props.baseFetch.result.map(elem =>
                <li key={elem.haslo.id_hasla}>
                    <SXVIIElem elem={elem} translation={props.translation} />
                </li>)}
        </ul>
    </div>;
}

function SXVIIElem(props) {
    return <>
        <SXVIIElemHasloHeader {...props} />
        <SXVIIElemHasloStanOpracowania {...props} />
        <SXVIIElemHasloSub {...props} />
        <SXVIIElemHasloFormy {...props} />
        <div><strong>{props.translation.get("sXVII.haslo.czm")}</strong>: {props.elem.haslo.czm}</div>
        <SXVIIElemZnaczenia {...props} />
        <SXVIIElemHasloAdditional {...props} />
    </>;
}

function formOrth(form) {
    let orth = form.forma
    if (form.homonimia)
        orth += ' ' + form.homonimia
    return orth
}

function SXVIIElemHasloHeader(props) {
    return <div>
        <strong>{formOrth(props.elem.formy[0])}</strong>
        {' '}
        <a href={sXVIIlink(props.elem.haslo.id_hasla)} target="blank">{props.translation.get("sXVII.link")}</a>
    </div>
}

function SXVIIElemHasloStanOpracowania(props) {
    const state = props.elem.haslo.stan_opracowania
    if (!state) return <></>
    const stateDesc = props.translation.getOrKey(state, "sXVII.stan_opracowania")
    if (stateDesc === "") return <></>
    return <div>{stateDesc}</div>
}

function SXVIIElemHasloSub(props) {
    const parent_id = props.elem.id_nadhasla
    return parent_id ?
        <div>
            <a href={sXVIIlink(parent_id)} target="blank">{props.translation.get("sXVII.parentLink")}</a>
        </div> :
        <></>
}

function SXVIIElemHasloAdditional(props) {
    const additional = props.elem.haslo.informacje_dodatkowe
    return additional ?
        <>
            <div><strong>{props.translation.get("sXVII.haslo.additional")}</strong></div>
            <div>{additional}</div>
        </> :
        <></>
}

function SXVIIElemHasloFormy(props) {
    let orths = props.elem.formy
    if (orths.length <= 1) return <></>
    return <div>
        <strong>{props.translation.get("sXVII.haslo.formy")}</strong>:
        {' '}
        {orths.slice(1).map(formOrth).join(", ")}
    </div>
}

function buildCytatyMap(cytaty) {
    const map = {}
    if (cytaty)
        for (const cytat of cytaty)
            if (cytat.typ === "znaczenia" && cytat.id_znaczenia)
                map[cytat.id_znaczenia] = cytat.cytat
    return map
}

function SXVIIEmptyZnaczenia(props) {
    return <div>{props.translation.get("sXVII.znaczenia.noResults")}</div>
}

function SXVIIElemZnaczeniaDef(props) {
    return props.definicja ?
        <div>»{props.definicja}«</div> :
        <></>
}

function SXVIIElemZnaczeniaCytat(props) {
    if (!props.cytat) return <></>
    let noHash = props.cytat.split("#").join("")
    let noRights = noHash.split("®").join("")
    return <i>{noRights}</i>
}

function SXVIIElemZnaczenia(props) {
    if (!props.elem.znaczenia)
        return <SXVIIEmptyZnaczenia {...props}/>
    let withDef = props.elem.znaczenia.filter(znaczenie => znaczenie.definicja && znaczenie.definicja !== "")
    if (withDef.length === 0)
        return <SXVIIEmptyZnaczenia {...props}/>
    const cytaty = buildCytatyMap(props.elem.cytaty)
    return <>
        <div><strong>{props.translation.get("sXVII.znaczenia")}</strong></div>
        <ul>
            {
                withDef.map(znaczenie =>
                    <li key={znaczenie.id_znaczenia}>
                        <SXVIIElemZnaczeniaDef definicja={znaczenie.definicja} />
                        <SXVIIElemZnaczeniaCytat cytat={cytaty[znaczenie.id_znaczenia]} />
                    </li>)
            }
        </ul>
    </>
}

export { SXVII, sXVIIsource }