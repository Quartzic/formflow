import {createSlice} from "@reduxjs/toolkit";

const metadataSlice = createSlice({
    name: 'metadata',
    initialState: null,
    reducers: {
        set: (state, action) => {
            return action.payload;
        },
        clear: () => {
            return null;
        }
    },
})

export default metadataSlice;