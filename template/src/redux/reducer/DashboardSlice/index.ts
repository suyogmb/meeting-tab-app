import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Endpoints} from '../../../networkConfig/Endpoints';
import HTTPService from '../../../networkConfig/HttpServices';
import {ThunkActions} from '../../../redux/constants';

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

// Define the error response type
interface ErrorResponse {
  message?: string;
}

export const getMoviesData = createAsyncThunk<
  Movie[], // Success response type
  void, // Argument type (none in this case)
  {rejectValue: ErrorResponse} // Rejected response type
>(ThunkActions.GET_MOVIES, async (_, {rejectWithValue, fulfillWithValue}) => {
  try {
    const response = await HTTPService.get(Endpoints.Movies);
    // Ensure response is an array before using fulfillWithValue
    if (Array.isArray(response)) {
      return fulfillWithValue(response) as unknown as Movie[];
    } else {
      return fulfillWithValue([response]) as unknown as Movie[]; // Wrap single object in an array
    }
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
