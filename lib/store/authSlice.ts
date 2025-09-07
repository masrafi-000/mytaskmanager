import api from "@/services/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

interface SignupRequestBody {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
}

interface SigninRequestBody {
  email: string;
  password: string;
}

interface AuthSuccessResponse {
  user: User;
  token: string;
  message?: string;
}

interface ApiErrorShape {
  response?: { data?: { message?: string } };
  message?: string;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  success: false,
};

export const signupUser = createAsyncThunk<
  AuthSuccessResponse,
  SignupRequestBody,
  { rejectValue: string }
>("auth/sign-up", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post<AuthSuccessResponse>(
      "/auth/sign-up",
      userData
    );
    return response.data;
  } catch (error) {
    const err = error as ApiErrorShape;
    return rejectWithValue(
      err.response?.data?.message || err.message || "Signup failed"
    );
  }
});

export const signinUser = createAsyncThunk<
  AuthSuccessResponse,
  SigninRequestBody,
  { rejectValue: string }
>("auth/login", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post<AuthSuccessResponse>(
      "/auth/login",
      userData
    );
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    const err = error as ApiErrorShape;
    return rejectWithValue(
      err.response?.data?.message || err.message || "Login failed"
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        signupUser.fulfilled,
        (state, action: PayloadAction<AuthSuccessResponse>) => {
          state.loading = false;
          state.success = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
          localStorage.setItem("token", action.payload.token);
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        }
      )
      .addCase(
        signupUser.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Signup failed";
        }
      )
      .addCase(signinUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        signinUser.fulfilled,
        (state, action: PayloadAction<AuthSuccessResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        }
      )
      .addCase(
        signinUser.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Login failed";
        }
      );
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
