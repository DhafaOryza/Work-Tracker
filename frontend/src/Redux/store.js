import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./taskSlice";
import tagReducer from "../Redux/tagSlice";

const store = configureStore({
    reducer: {
        tasks: taskReducer,
        tags: tagReducer,
    },
});

export default store;