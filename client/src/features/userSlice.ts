import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userService } from "../services/userService";
import type {
  IAuthRestoreResponse,
  ILoginData,
  ILoginResponse,
  ISignUpData,
  ISignUpResponse,
  IUserState,
} from "../interfaces/user";
import { handleAsyncThunkError } from "../utils/errorHandling";

const initialState: IUserState = {
  loading: false,
  error: null,
  token: localStorage.getItem("userToken") || null,
  isAuthenticated: !!localStorage.getItem("userToken"),
  userId: "",
  user: {
    _id: "",
    name: "",
    email: "",
  },
};

export const signupUser = createAsyncThunk<
  ISignUpResponse,
  ISignUpData,
  { rejectValue: { message: string } }
>(
  "user/signUpUser",
  async (submissionData: ISignUpData, { rejectWithValue }) => {
    try {
      const response = await userService.signUp(submissionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleAsyncThunkError(error));
    }
  }
);

export const loginUser = createAsyncThunk<
  ILoginResponse,
  ILoginData,
  { rejectValue: { message: string } }
>("user/loginUser", async (loginData, { rejectWithValue }) => {
  try {
    const response = await userService.login(loginData);
    localStorage.setItem("userToken", response.data.token);
    return response.data;
  } catch (error) {
    return rejectWithValue(handleAsyncThunkError(error));
  }
});

export const restoreUserAuth = createAsyncThunk<
  IAuthRestoreResponse,
  void,
  { rejectValue: { message: string } }
>("user/restoreAuth", async (_, { rejectWithValue }) => {
  try {
    const response = await userService.verifyToken();
    return response.data;
  } catch (error) {
    localStorage.removeItem("userToken");
    return rejectWithValue(handleAsyncThunkError(error));
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.userId = "";
      localStorage.removeItem("userToken");
    },
  },
  extraReducers: (builder) => {
    builder
      // user signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Error occurred during sign up";
      })

      // user login

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Error occurred during login";
      })
      // restore authentication

      .addCase(restoreUserAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(restoreUserAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.userId = action.payload.user.userId;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })

      .addCase(restoreUserAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Invalid token";
      });
  },
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
