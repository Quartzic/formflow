import {createSlice} from "@reduxjs/toolkit";

const submissionsSlice = createSlice({
    name: 'submissions',
    initialState: [],
    reducers: {
        add: (state, action) => {
            state.push(action.payload)
        },
        remove: (state, action) => {
            state.splice(action.payload, 1)
        },
        update: (state, action) => {
            state[action.payload[0]] = action.payload[1]
        },
        clear: () => {
            return [];
        }
    },
})

export default submissionsSlice;