import {createSlice} from "@reduxjs/toolkit";

const workflowSlice = createSlice({
    name: 'workflow',
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

export default workflowSlice;