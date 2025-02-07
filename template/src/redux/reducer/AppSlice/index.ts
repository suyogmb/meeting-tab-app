import {createSlice} from '@reduxjs/toolkit';

export interface AppState {
  accessToken: string;
}

const initialState: AppState = {
  accessToken: '',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setToken} = appSlice.actions;

export default appSlice.reducer;
