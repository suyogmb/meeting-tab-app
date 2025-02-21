import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {ThunkActions} from '../../../redux/constants';

export interface UserState {
  userProfile: object;
}

const initialState: UserState = {
  userProfile: {},
};

// Define the expected response type
interface UserProfileResponse {
  id: number;
  name: string;
  email: string;
}

// Define the error response type
interface ErrorResponse {
  message: string;
}

// export const getUserProfileData = createAsyncThunk<
//   UserProfileResponse, // Success response type
//   void, // Argument type (none in this case)
//   {rejectValue: ErrorResponse} // Rejected response type
// >(ThunkActions.GET_USER_PROFILE, async (_, {dispatch, rejectWithValue, fulfillWithValue}) => {
//   try {
//Actual api call here
// const response = await HTTPService.get(Endpoints().searchAll);
// if (response?.status_code === 200) {
//   return fulfillWithValue(response?.data);
// } else {
//   return rejectWithValue({message: 'Failed to fetch user profile'});
// }
//   } catch (error: any) {
//     return rejectWithValue({message: error.message || 'Something went wrong'});
//   }
// });

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // builder.addCase(getUserProfileData.pending, (state, action) => {});
    // builder.addCase(getUserProfileData.fulfilled, (state, action) => {
    //   state.userProfile = action.payload;
    // });
    // builder.addCase(getUserProfileData.rejected, (state, action) => {});
  },
});

// Action creators are generated for each case reducer function
export const {} = userSlice.actions;

export default userSlice.reducer;
