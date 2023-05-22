
// stateLogic should have fields:
// {
//     input() // returns info about selected input {
//         searchType: 'base' or 'orth',
//         sources: { source: true - if source was selected },
//         query: string
//     }
//     setState(oldState => newState) // can be called when the state needs to be updated
//     -- bases() // info about all fetched bases
//     -- updateBases(newBases) // inform about bases fetched by this type
// }

class Source {
    constructor(key, searchBase, searchOrth) {
        this.mKey = key
        this.mSearchBase = searchBase // function(stateLogic) for fetching base
        this.mSearchOrth = searchOrth // function(stateLogic) for fetching orth
    }

    // Source name - key to use to store state
    key() { return this.mKey; }

    // Can source be searched for data for the given search type
    canSearch(searchType) {
        switch (searchType) {
            case 'base': return !!this.mSearchBase
            case 'orth': return !!this.mSearchOrth
            default: return false
        }
    }

    fetchData(stateLogic) {
        let inputState = stateLogic.input()
        if (!inputState.sources[this.key()]) return
        switch (inputState.searchType) {
            case 'base':
                if (this.mSearchBase)
                    this.mSearchBase(stateLogic)
                break
            case 'orth':
                if (this.mSearchOrth)
                    this.mSearchOrth(stateLogic)
                break
            default:
                // do nothing
        }
    }
}

export default Source