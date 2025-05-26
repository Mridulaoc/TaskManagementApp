import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { taskService } from "../services/taskService";
import { handleAsyncThunkError } from "../utils/errorHandling";
import {
  IFetchTasksInput,
  IFetchTasksResponse,
  ITaskInitialState,
} from "../interfaces/task";

const initialState: ITaskInitialState = {
  loading: false,
  error: null,
  tasks: [],
  total: 0,
  page: 0,
  limit: 0,
};

export const fetchAllTasks = createAsyncThunk<
  IFetchTasksResponse,
  IFetchTasksInput,
  { rejectValue: { message: string } }
>(
  "task/fetchAllTasks",
  async (params: IFetchTasksInput, { rejectWithValue }) => {
    try {
      const response = await taskService.fetchTasks(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleAsyncThunkError(error));
    }
  }
);

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
        state.total = action.payload.total;
      })
      .addCase(fetchAllTasks.rejected, (state) => {
        state.loading = false;
        state.error = "Could not fetch tasks";
      });
  },
});

export default taskSlice.reducer;
