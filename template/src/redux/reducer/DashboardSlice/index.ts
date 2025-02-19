import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Endpoints} from '../../../networkConfig/Endpoints';
import HTTPService from '../../../networkConfig/HttpServices';

export interface Movie {
  name?: string;
  imageurl?: string;
  publisher?: string;
}

export interface DashboardState {
  movieData: Movie[];
}

const initialState: DashboardState = {
  movieData: [],
};

// Define the expected response type
interface DashboardResponse {
  name?: string;
  imageurl?: string;
  publisher?: string;
}

// Define the error response type
interface ErrorResponse {
  message: string;
}

export const getMoviesData = createAsyncThunk<
  DashboardResponse, // Success response type
  void, // Argument type (none in this case)
  {rejectValue: ErrorResponse} // Rejected response type
>('home/dashboard', async (_, {dispatch, rejectWithValue, fulfillWithValue}) => {
  try {
    const response = await HTTPService.get(Endpoints.Movies);
    return fulfillWithValue(response);
  } catch (error: any) {
    return rejectWithValue({message: error.message || 'Something went wrong'});
  }
});

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMoviesData.pending, (state, action) => {});
    builder.addCase(getMoviesData.fulfilled, (state, action) => {
      state.movieData = action.payload;
    });
    builder.addCase(getMoviesData.rejected, (state, action) => {});
  },
});

// Action creators are generated for each case reducer function
export const {} = dashboardSlice.actions;

export default dashboardSlice.reducer;
