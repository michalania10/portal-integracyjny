
// stateLogic should have fields:
// {
//     input() // returns info about selected input {
//         fetchType: 'base' or 'orth',
//         sources: { source: true - if source was selected },
//         query: string
//     }
//     setState(oldState => newState) // can be called when the state needs to be updated
//     -- bases() // info about all fetched bases
//     -- updateBases(newBases) // inform about bases fetched by this type
// }

class Source {
    constructor(key, fetchBase, fetchOrth) {
        this.mKey = key
        this.mFetchBase = fetchBase // function(stateLogic) for fetching base
        this.mFetchOrth = fetchOrth // function(stateLogic) for fetching orth
    }

    // Source name - key to use to store state
    key() { return this.mKey; }

    // Can source be searched for data for the given search type
    canSearch(fetchType) {
        switch (fetchType) {
            case 'base': return !!this.mFetchBase
            case 'orth': return !!this.mFetchOrth
            default: return false
        }
    }

    fetchData(stateLogic) {
        let inputState = stateLogic.input()
        if (!inputState.sources[this.key()]) return
        switch (inputState.fetchType) {
            case 'base':
                if (this.mFetchBase)
                    this.mFetchBase(stateLogic)
                break
            case 'orth':
                if (this.mFetchOrth)
                    this.mFetchOrth(stateLogic)
                break
            default:
                // do nothing
        }
    }
}

export default Source