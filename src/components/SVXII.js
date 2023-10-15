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
    let elemsToShow = orderElems(props.baseFetch.result)
    return <div>
        <ul>
            {elemsToShow.map(elem =>
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

function orderElems(elems) {
    let nadHasla = {}
    elems.filter(elem => !elem.id_nadhasla)
        .forEach(elem => nadHasla[elem.haslo.id_hasla] = true)

    let toShow = elems.filter(elem => !elem.id_nadhasla || !nadHasla[elem.id_nadhasla])
    toShow.sort(compareElems)
    return toShow
}

function compareElems(a, b) {
    let nadHasloA = a.id_nadhasla ? "z" : "a"
    let nadHasloB = b.id_nadhasla ? "z" : "a"
    let cmpNadHaslo = nadHasloA.localeCompare(nadHasloB, "pl")
    if (cmpNadHaslo !== 0) return cmpNadHaslo

    let formOrthA = headForm(a)
    let formOrthB = headForm(b)
    let cmpFormOrth = formOrthA.localeCompare(formOrthB, "pl")
    if (cmpFormOrth !== 0) return cmpFormOrth

    if (a.haslo.id_hasla < b.haslo.id_hasla) return -1
    if (a.haslo.id_hasla > b.haslo.id_hasla) return 1
    return 0
}

function formOrth(form) {
    let orth = form.forma
    if (form.homonimia)
        orth += ' ' + form.homonimia
    return orth
}

function headForm(elem) {
    let formyHaslowe = elem.formy.filter(form => form.typ === "forma hasłowa")
    if (formyHaslowe.length > 0) return formOrth(formyHaslowe[0])

    return formOrth(elem.formy[0])
}

function SXVIIElemHasloHeader(props) {
    return <div>
        <strong>{headForm(props.elem)}</strong>
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
            <div><strong>{props.translation.get("sXVII.sub")}</strong></div>
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
    let headF = headForm(props.elem)
    return <div>
        <strong>{props.translation.get("sXVII.haslo.formy")}</strong>:
        {' '}
        {orths.map(formOrth).filter(f => f !== headF).join(", ")}
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

function SXVIIElemZnaczenie(props) {
    return <>
        <SXVIIElemZnaczeniaDef definicja={props.znaczenie.definicja} />
        <SXVIIElemZnaczeniaCytat cytat={props.cytaty[props.znaczenie.id_znaczenia]} />
    </>
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

function buildZnaczenia(elem) {
    let withDef = elem.znaczenia.filter(znaczenie => znaczenie.definicja && znaczenie.definicja !== "")
    withDef.sort(compareZnaczenia)
    let list = []
    withDef.forEach(znaczenie => {
        if (znaczenie.lpp) {
            let subs = list[znaczenie.lp].subs
            subs[subs.length] = znaczenie
        } else {
            list[znaczenie.lp] = { main: znaczenie, subs: [] }
        }
    })
    return list
}

function compareZnaczenia(a, b) {
    if (a.lp < b.lp) return -1
    if (a.lp > b.lp) return 1

    if (!a.lpp && b.lpp) return -1
    if (a.lpp && !b.lpp) return 1
    if (!a.lpp && !b.lpp) return 0

    if (a.lpp < b.lpp) return -1
    return 1
}

function SXVIIZnaczeniePair(props) {
    return <>
        <SXVIIElemZnaczenie znaczenie={props.pair.main} cytaty={props.cytaty}/>
        {
            (props.pair.subs.length > 0) ? <ul>
                {
                    props.pair.subs.map(sub =>
                        <li key={sub.id_znaczenia}>
                            <SXVIIElemZnaczenie znaczenie={sub} cytaty={props.cytaty}/>
                        </li>)
                }
            </ul> : <></>
        }
    </>
}

function SXVIIElemZnaczenia(props) {
    if (!props.elem.znaczenia)
        return <SXVIIEmptyZnaczenia {...props}/>
    const znaczenia = buildZnaczenia(props.elem)
    if (znaczenia.length === 0)
        return <SXVIIEmptyZnaczenia {...props}/>
    const cytaty = buildCytatyMap(props.elem.cytaty)
    return <>
        <div><strong>{props.translation.get("sXVII.znaczenia")}</strong></div>
        <ul>
            {
                znaczenia.map(pair =>
                    <li key={pair.main.id_znaczenia}>
                        <SXVIIZnaczeniePair pair={pair} cytaty={cytaty} />
                    </li>)
            }
        </ul>
    </>
}

export { SXVII, sXVIIsource }