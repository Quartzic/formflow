import {reducers} from "./store";

test('reducers', () => {
    let state = reducers(undefined, {type: '@@INIT'});
    state = reducers(state, {type:'metadata/set',payload:{username:'JohnDoe123',refNumber:'453459012',workflow:'validation',timestamp:'2022-06-21T17:24:19.020Z'}});
    expect(state).toEqual({submissions:{past:[],present:[],future:[],group:null,_latestUnfiltered:[],index:0,limit:1},barcodes:{past:[],present:[],future:[],group:null,_latestUnfiltered:[],index:0,limit:1},workflow:null,metadata:{username:'JohnDoe123',refNumber:'453459012',workflow:'validation',timestamp:'2022-06-21T17:24:19.020Z'}});
});
