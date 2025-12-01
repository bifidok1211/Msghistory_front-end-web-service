import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import { logoutUser } from './userSlice';

interface CartState {
    msghistory_id: number | null;
    count: number;
    loading: boolean;
    error: string | null
}

const initialState: CartState = {
    msghistory_id: null,
    count: 0,
    loading: false,
    error: null,
};

// Получение бейджика (кол-во каналов в черновике)
export const fetchCartBadge = createAsyncThunk(
    'cart/fetchCartBadge',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.msghistory.channelscartList();
            return response.data;
        } catch {
            // Исправление: ТА САМАЯ ОШИБКА ИЗ СКРИНШОТА.
            // Убираем аргумент error, так как он не используется.
            return rejectWithValue('Failed to fetch cart');
        }
    }
);

// Добавление канала в черновик
export const addChannelToDraft = createAsyncThunk(
    'cart/addToDraft',
    async (channelId: number, { dispatch, rejectWithValue }) => {
        try {
            await api.msghistory.draftChannelsCreate(channelId);
            // Обновляем бейдж после успешного добавления
            dispatch(fetchCartBadge());
            return channelId;
        } catch (error) {
            // Исправление: приводим к any, чтобы линтер и TS не ругались
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const err = error as any;
            alert("Ошибка при добавлении: " + (err.response?.data?.description || "Неизвестная ошибка"));
            return rejectWithValue('Failed to add');
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartBadge.fulfilled, (state, action) => {
                state.msghistory_id = action.payload.msghistory_id || null;
                state.count = action.payload.count || 0;
            })
            .addCase(fetchCartBadge.rejected, (state) => {
                state.msghistory_id = null;
                state.count = 0;
            })
            .addCase(logoutUser.fulfilled, () => initialState);
    }
});

export default cartSlice.reducer;