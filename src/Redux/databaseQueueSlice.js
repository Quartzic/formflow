import {createSlice} from "@reduxjs/toolkit";

const databaseQueueSlice = createSlice({
    name: 'databaseQueue',
    initialState: [],
    reducers: {
        add: (state, action) => {
            state.push(action.payload)
        },
        clear: () => {
            return [];
        }
    },
})

export default databaseQueueSlice;