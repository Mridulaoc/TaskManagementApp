import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminService } from "../services/adminService";
import type {
  ILoginData,
  ILoginResponse,
  ISignUpData,
  ISignUpResponse,
} from "../interfaces/admin";
import { handleAsyncThunkError } from "../utils/errorHandling";
import type { IAdminState } from "../interfaces/admin";
import { IUser } from "../interfaces/user";

const initialState: IAdminState = {
  loading: false,
  error: null,
  token: localStorage.getItem("adminToken") || null,
  isAuthenticated: !!localStorage.getItem("adminToken"),
  users: [],
};

export const adminSignUp = createAsyncThunk<
  ISignUpResponse,
  ISignUpData,
  { rejectValue: { message: string } }
>(
  "admin/adminSignUp",
  async (submissionData: ISignUpData, { rejectWithValue }) => {
    try {
      const response = await adminService.signUp(submissionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleAsyncThunkError(error));
    }
  }
);

export const adminLogin = createAsyncThunk<
  ILoginResponse,
  ILoginData,
  { rejectValue: { message: string } }
>("user/loginUser", async (loginData, { rejectWithValue }) => {
  try {
    const response = await adminService.login(loginData);
    localStorage.setItem("adminToken", response.data.token);
    return response.data;
  } catch (error) {
    return rejectWithValue(handleAsyncThunkError(error));
  }
});

export const fetchAllUsers = createAsyncThunk<
  IUser[],
  void,
  { rejectValue: { message: string } }
>("admin/fetchAllUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await adminService.fetchAllUsers();
    return response.data;
  } catch (error) {
    return rejectWithValue(handleAsyncThunkError(error));
  }
});

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Admin SignUp
      .addCase(adminSignUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminSignUp.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(adminSignUp.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Error occurred during sign up";
      })
      // Admin Login
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Error occurred during login";
      })

      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Could not fetch users";
      });
  },
});

export default adminSlice.reducer;
