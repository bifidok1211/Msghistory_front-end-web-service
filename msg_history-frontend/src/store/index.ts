import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './slices/filterSlice';
import channelsReducer from './slices/channelsSlice';
import cartReducer from './slices/cartSlice';
import userReducer from './slices/userSlice';
import msghistoryReducer from './slices/msghistorySlice';

export const store = configureStore({
    reducer: {
        filter: filterReducer,
        channels: channelsReducer,
        cart: cartReducer,
        user: userReducer,
        msghistory: msghistoryReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;