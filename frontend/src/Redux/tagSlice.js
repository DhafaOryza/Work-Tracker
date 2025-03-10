import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch tags
export const fetchTags = createAsyncThunk("tags/fetchTags", async () => {
    const response = await axios.get("http://localhost:5000/api/tags");
    return response.data;
});

// Add new tag or subtag
export const addTag = createAsyncThunk("tags/addTag", async (newTag) => {
    const response = await axios.post("http://localhost:5000/api/tags", newTag);
    return response.data;
});

const tagSlice = createSlice({
    name: "tags",
    initialState: { tags: [], subtags: [], status: "idle" },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTags.fulfilled, (state, action) => {
                state.tags = action.payload.tag;
                state.subtags = action.payload.subtag;
            })
            .addCase(addTag.fulfilled, (state, action) => {
                state.tags = action.payload.tag;
                state.subtags = action.payload.subtag;
            });
    },
});

export default tagSlice.reducer;
