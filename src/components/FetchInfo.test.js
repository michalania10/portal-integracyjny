import {updatedState} from "./FetchInfo";

it('updatedState simple', () => {
    expect(updatedState({one: {two:{}}}, ['one', 'two'], 'value').one.two)
        .toEqual('value')
    expect(updatedState({one: [11]}, ['one', 0], x => x + 1).one[0])
        .toEqual(12)
    expect(updatedState({one: {two:{}}}, 'one.two', 'value').one.two)
        .toEqual('value')
})

it('updatedState single field', () => {
    expect(updatedState({one: 1, two: 2}, 'one', 'value'))
        .toEqual({one:'value', two: 2})
    expect(updatedState(['one', ''], 1, x => x + 'value'))
        .toEqual(['one', 'value'])
    expect(updatedState({one: 1, two: 2}, 'two', null))
        .toEqual({one: 1, two: null})
})

it( "updatedState nulls", () => {
    expect(updatedState(null, 'x', 'value'))
        .toEqual({x: 'value'})
    let notDefined;
    expect(updatedState(notDefined, 'x', x => 'value'))
        .toEqual({x: 'value'})
    expect(updatedState(null, 'x.y.z', 'value'))
        .toEqual({x:{y:{z:'value'}}})
    expect(updatedState({}, 'x', 'value'))
        .toEqual({x:'value'})
    expect(updatedState(notDefined, 0, 11))
        .toEqual([11])
    expect(updatedState([], [0,1], 'value'))
        .toEqual([[notDefined, 'value']])
})