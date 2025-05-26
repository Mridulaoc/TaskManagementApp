import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import adminReducer from "../features/adminSlice";
import taskReducer from "../features/taskSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer,
    task: taskReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
