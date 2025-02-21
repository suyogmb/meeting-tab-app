import {configureStore} from '@reduxjs/toolkit';
import counterReducer from '../reducer/CounterSlice';
import appReducer from '../reducer/AppSlice';
import userReducer from '../reducer/UserSlice';
import dashboardSlice from '../reducer/DashboardSlice';

const store = configureStore({
  reducer: {
    counter: counterReducer,
    app: appReducer,
    user: userReducer,
    dashboard: dashboardSlice,
  },
});

export default store;

// Infer the `ReduxStateType` and `AppDispatch` types from the store itself
export type ReduxStateType = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
