import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import adminReducer from "../features/adminSlice";
import taskReducer from "../features/taskSlice";
import notificationReducer from "../features/notificationSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer,
    task: taskReducer,
    notification: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
