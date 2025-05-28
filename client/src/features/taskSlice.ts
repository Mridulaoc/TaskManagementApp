import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
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
  IUpdateSubTaskResponse,
  IUpdateTaskData,
  IUpdateTaskResponse,
  IUpdateTaskStatusResponse,
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
  userTasks: [],
  updatingTaskStatus: false,
  updatingSubtask: false,
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

export const fetchUserTasks = createAsyncThunk<
  ITask[],
  string,
  { rejectValue: { message: string } }
>("task/fetchUserTasks", async (userId: string, { rejectWithValue }) => {
  try {
    const response = await taskService.fetchUserTasks(userId);
    return response.data;
  } catch (error) {
    return rejectWithValue(handleAsyncThunkError(error));
  }
});

export const updateSubtaskStatus = createAsyncThunk<
  IUpdateSubTaskResponse,
  { taskId: string; subtaskId: string; isCompleted: boolean },
  { rejectValue: { message: string } }
>(
  "task/updateSubtaskStatus",
  async ({ taskId, subtaskId, isCompleted }, { rejectWithValue }) => {
    try {
      const response = await taskService.updateSubtaskStatus(
        taskId,
        subtaskId,
        isCompleted
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(handleAsyncThunkError(error));
    }
  }
);

export const updateTaskStatus = createAsyncThunk<
  IUpdateTaskStatusResponse,
  { taskId: string; status: "pending" | "in-progress" | "completed" },
  { rejectValue: { message: string } }
>("task/updateTaskStatus", async ({ taskId, status }, { rejectWithValue }) => {
  try {
    const response = await taskService.updateTaskStatus(taskId, status);
    return response.data;
  } catch (error) {
    return rejectWithValue(handleAsyncThunkError(error));
  }
});
const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    addNewTaskRealTime: (state, action: PayloadAction<ITask>) => {
      const newTask = action.payload;
      const existingTaskIndex = state.userTasks.findIndex(
        (task) => task._id === newTask._id
      );

      if (existingTaskIndex === -1) {
        state.userTasks.unshift(newTask);
      }
    },

    updateTaskRealTime: (state, action: PayloadAction<ITask>) => {
      const updatedTask = action.payload;
      const userTaskIndex = state.userTasks.findIndex(
        (task) => task._id === updatedTask._id
      );
      if (userTaskIndex !== -1) {
        state.userTasks = [
          ...state.userTasks.slice(0, userTaskIndex),
          { ...updatedTask },
          ...state.userTasks.slice(userTaskIndex + 1),
        ];
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
      if (state.task._id === updatedTask._id) {
        state.task = updatedTask;
      }
    },

    removeTaskRealTime: (state, action: PayloadAction<{ taskId: string }>) => {
      const { taskId } = action.payload;

      state.userTasks = state.userTasks.filter((task) => task._id !== taskId);

      state.tasks = state.tasks.filter((task) => task._id !== taskId);

      state.total = Math.max(0, state.total - 1);

      console.log("Task removed:", taskId);
    },

    updateSubtaskRealtime: (
      state,
      action: PayloadAction<{
        taskId: string;
        subtaskId: string;
        isCompleted: boolean;
      }>
    ) => {
      const { taskId, subtaskId, isCompleted } = action.payload;

      const userTaskIndex = state.userTasks.findIndex(
        (task) => task._id === taskId
      );

      if (userTaskIndex !== -1 && state.userTasks[userTaskIndex].subtasks) {
        const subtaskIndex = state.userTasks[userTaskIndex].subtasks!.findIndex(
          (subtask) => subtask._id === subtaskId
        );

        if (subtaskIndex !== -1) {
          state.userTasks[userTaskIndex].subtasks![subtaskIndex].isCompleted =
            isCompleted;
        }
      }

      if (state.task._id === taskId && state.task.subtasks) {
        const subtaskIndex = state.task.subtasks.findIndex(
          (subtask) => subtask._id === subtaskId
        );

        if (subtaskIndex !== -1) {
          state.task.subtasks[subtaskIndex].isCompleted = isCompleted;
        }
      }
    },

    updateTaskStatusRealtime: (
      state,
      action: PayloadAction<{
        taskId: string;
        status: "pending" | "in-progress" | "completed";
      }>
    ) => {
      const { taskId, status } = action.payload;

      const userTaskIndex = state.userTasks.findIndex(
        (task) => task._id === taskId
      );

      if (userTaskIndex !== -1) {
        state.userTasks[userTaskIndex].status = status;
      }

      const taskIndex = state.tasks.findIndex((task) => task._id === taskId);

      if (taskIndex !== -1) {
        state.tasks[taskIndex].status = status;
      }

      if (state.task._id === taskId) {
        state.task.status = status;
      }
    },
    clearError: (state) => {
      state.error = null;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
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
      })
      // fetch user tasks
      .addCase(fetchUserTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.userTasks = action.payload;
      })
      // update sub task status

      .addCase(updateSubtaskStatus.pending, (state) => {
        state.updatingSubtask = true;
        state.error = null;
      })
      .addCase(updateSubtaskStatus.fulfilled, (state, action) => {
        state.updatingSubtask = false;
        const { taskId, subtaskId, isCompleted } = action.payload;
        const taskIndex = state.userTasks.findIndex(
          (task) => task._id === taskId
        );
        if (taskIndex !== -1 && state.userTasks[taskIndex].subtasks) {
          const subtaskIndex = state.userTasks[taskIndex].subtasks!.findIndex(
            (subtask) => subtask._id === subtaskId
          );
          if (subtaskIndex !== -1) {
            state.userTasks[taskIndex].subtasks![subtaskIndex].isCompleted =
              isCompleted;
          }
        }
      })
      .addCase(updateSubtaskStatus.rejected, (state, action) => {
        state.updatingSubtask = false;
        state.error = action.payload?.message || "Failed to update subtask";
      })
      // Update task status
      .addCase(updateTaskStatus.pending, (state) => {
        state.updatingTaskStatus = true;
        state.error = null;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.updatingTaskStatus = false;
        const { taskId, status } = action.payload;
        const taskIndex = state.userTasks.findIndex(
          (task) => task._id === taskId
        );
        if (taskIndex !== -1) {
          state.userTasks[taskIndex].status = status;
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.updatingTaskStatus = false;
        state.error = action.payload?.message || "Failed to update task status";
      });
  },
});
export const {
  addNewTaskRealTime,
  updateTaskRealTime,
  removeTaskRealTime,
  updateSubtaskRealtime,
  updateTaskStatusRealtime,
  clearError,
  setLoading,
} = taskSlice.actions;
export default taskSlice.reducer;
