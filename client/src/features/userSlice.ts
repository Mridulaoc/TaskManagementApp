import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userService } from "../services/userService";
import type {
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

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Error occurred during login";
      });
  },
});

export default userSlice.reducer;
