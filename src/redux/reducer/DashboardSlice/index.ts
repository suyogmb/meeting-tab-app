import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {ErrorResponse, MovieDetails} from 'types/types';
import {Endpoints} from '../../../networkConfig/Endpoints';
import HTTPService from '../../../networkConfig/HttpServices';
import {ThunkActions} from '../../../redux/constants';

export interface DashboardState {
  movieData: MovieDetails[];
}

const initialState: DashboardState = {
  movieData: [],
};

// Define the error response type

export const getMoviesData = createAsyncThunk<
  MovieDetails[], // Success response type
  void, // Argument type (none in this case)
  {rejectValue: ErrorResponse} // Rejected response type
>(ThunkActions.GET_MOVIES, async (_, {rejectWithValue, fulfillWithValue}) => {
  try {
    const response = await HTTPService.get(Endpoints.Movies);
    // Ensure response is an array before using fulfillWithValue
    if (Array.isArray(response)) {
      return fulfillWithValue(response) as unknown as MovieDetails[];
    } else {
      return fulfillWithValue([response]) as unknown as MovieDetails[]; // Wrap single object in an array
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue({message: error.message});
    }
    return rejectWithValue({message: 'Something went wrong'});
  }
});

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMoviesData.pending, (_state, _action) => {});
    builder.addCase(getMoviesData.fulfilled, (state, action) => {
      state.movieData = action.payload;
    });
    builder.addCase(getMoviesData.rejected, (_state, _action) => {});
  },
});

// Action creators are generated for each case reducer function
//FIXME: Need to add action creators for the async actions
// export const {} = dashboardSlice.actions;

export default dashboardSlice.reducer;
