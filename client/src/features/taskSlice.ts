import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { taskService } from "../services/taskService";
import { handleAsyncThunkError } from "../utils/errorHandling";
import {
  IAddTaskResponse,
  IDeleteTaskResponse,
  IFetchTasksInput,
  IFetchTasksResponse,
  ITask,
  ITaskFormInput,
  ITaskInitialState,
  IUpdateTaskData,
  IUpdateTaskResponse,
} from "../interfaces/task";

const initialState: ITaskInitialState = {
  loading: false,
  error: null,
  task: {
    _id: "",
    title: "",
    description: "",
    status: "pending",
    assignedTo: [],
    dueDate: undefined,
    priority: "low",
    subtasks: [
      {
        title: "",
        isCompleted: false,
      },
    ],
  },
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
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleAsyncThunkError(error));
    }
  }
);

export const addTask = createAsyncThunk<
  IAddTaskResponse,
  ITaskFormInput,
  { rejectValue: { message: string } }
>("task/addTask", async (taskFormData: ITaskFormInput, { rejectWithValue }) => {
  try {
    const response = await taskService.addTask(taskFormData);
    return response.data;
  } catch (error) {
    return rejectWithValue(handleAsyncThunkError(error));
  }
});

export const fetchTask = createAsyncThunk<
  ITask,
  string,
  { rejectValue: { message: string } }
>("task/fetchTask", async (taskId: string, { rejectWithValue }) => {
  try {
    const response = await taskService.fetchTask(taskId);
    return response.data;
  } catch (error) {
    return rejectWithValue(handleAsyncThunkError(error));
  }
});

export const updateTask = createAsyncThunk<
  IUpdateTaskResponse,
  { taskId: string; taskData: IUpdateTaskData },
  { rejectValue: { message: string } }
>(
  "task/updateTask",
  async (
    { taskId, taskData }: { taskId: string; taskData: IUpdateTaskData },
    { rejectWithValue }
  ) => {
    try {
      const response = await taskService.updatetask(taskId, taskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleAsyncThunkError(error));
    }
  }
);

export const deleteTask = createAsyncThunk<
  IDeleteTaskResponse,
  string,
  { rejectValue: { message: string } }
>("task/deleteTask", async (taskId: string, { rejectWithValue }) => {
  try {
    const response = await taskService.deleteTask(taskId);
    return response.data;
  } catch (error) {
    return rejectWithValue(handleAsyncThunkError(error));
  }
});

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch all tasks
      .addCase(fetchAllTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks || [];
        state.total = action.payload.total;
      })
      .addCase(fetchAllTasks.rejected, (state) => {
        state.loading = false;
        state.error = "Could not fetch tasks";
      })
      // add task
      .addCase(addTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Could not add new task";
      })
      // fetch task
      .addCase(fetchTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTask.fulfilled, (state, action) => {
        state.loading = false;
        state.task = action.payload;
      })
      .addCase(fetchTask.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Could fetch the task by given id";
      })

      // updateTask
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload && action.payload.task) {
          const updatedTask = action.payload.task;
          if (state.task._id === updatedTask._id) {
            state.task = { ...updatedTask };
          }
          const taskIndex = state.tasks.findIndex(
            (task) => task._id === updatedTask._id
          );
          if (taskIndex !== -1) {
            state.tasks = [
              ...state.tasks.slice(0, taskIndex),
              { ...updatedTask },
              ...state.tasks.slice(taskIndex + 1),
            ];
          }
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Could not update task";
      })
      // delete task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const deletedTaskId = action.meta.arg;
        state.tasks = state.tasks.filter((task) => task._id !== deletedTaskId);
        state.total = Math.max(0, state.total - 1);
      });
  },
});

export default taskSlice.reducer;
