import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import { logoutUser } from './userSlice'; 
import type { 
    DsMsghistoryDTO, 
    DsMsghistoryUpdateRequest, 
    DsChannelToMsghistoryUpdateRequest 
} from '../../api/Api';

interface MsghistoryState {
    list: DsMsghistoryDTO[];           
    currentMsghistory: DsMsghistoryDTO | null; 
    loading: boolean;
    error: string | null;
    operationSuccess: boolean;  
}

const initialState: MsghistoryState = {
    list: [],
    currentMsghistory: null,
    loading: false,
    error: null,
    operationSuccess: false,
};

// --- 1. Получение списка заявок (с фильтрами) ---
export const fetchMsghistoryList = createAsyncThunk(
    'msghistory/fetchList',
    async (filters: { status?: string; from?: string; to?: string }, { rejectWithValue }) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const queryArgs: any = {};
            if (filters.status && filters.status !== 'all') queryArgs.status = parseInt(filters.status);
            if (filters.from) queryArgs.from = filters.from;
            if (filters.to) queryArgs.to = filters.to;
            
            const response = await api.msghistory.msghistoryList(queryArgs);
            return response.data;
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const err = error as any;
            return rejectWithValue(err.response?.data?.description || 'Ошибка загрузки списка');
        }
    }
);

// --- 2. Получение одной заявки по ID ---
export const fetchMsghistoryById = createAsyncThunk(
    'msghistory/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await api.msghistory.msghistoryDetail(parseInt(id));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data: any = response.data;
            
            // Маппинг каналов
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mappedChannels = (data.channels || []).map((c: any) => ({
                channel_id: c.channel_id ?? 0,
                title: c.title ?? 'Без названия',
                image: c.image ?? '',
                text: c.text ?? '',
                subscribers: c.subscribers ?? 0,
                repost_level: c.repost_level ?? 0,
                views: c.views ?? 0
            }));

            const mappedOrder: DsMsghistoryDTO = {
                id: data.id,
                status: data.status ?? 1, 
                description: data.description ?? '',
                creator_login: data.creator_login, // Нужно для модератора
                coverage: data.coverage ?? 0,
                coefficient: data.coefficient ?? 0,
                creation_date: data.creation_date,
                forming_date: data.forming_date,
                complition_date: data.complition_date,
                channels: mappedChannels
            };
            
            return mappedOrder;
        } catch {
            return rejectWithValue('Заявка не найдена');
        }
    }
);

// --- 3. Сохранение полей ---
export const updateMsghistoryFields = createAsyncThunk(
    'msghistory/updateFields',
    async ({ id, data }: { id: number; data: DsMsghistoryUpdateRequest }, { rejectWithValue }) => {
        try {
            await api.msghistory.msghistoryUpdate(id, data);
            return data;
        } catch {
            return rejectWithValue('Ошибка сохранения');
        }
    }
);

// --- 4. Обновление канала в заявке ---
export const updateChannelInMsghistory = createAsyncThunk(
    'msghistory/updateChannel',
    async ({ msghistoryId, channelId, data }: { msghistoryId: number; channelId: number; data: DsChannelToMsghistoryUpdateRequest }, { rejectWithValue }) => {
        try {
            await api.msghistory.channelsUpdate(msghistoryId, channelId, data);
            return { channelId, data };
        } catch {
            return rejectWithValue('Не удалось обновить данные канала в заявке');
        }
    }
);

// --- 5. Удаление канала ---
export const removeChannelFromMsghistory = createAsyncThunk(
    'msghistory/removeChannel',
    async ({ msghistoryId, channelId }: { msghistoryId: number; channelId: number }, { rejectWithValue }) => {
        try {
            await api.msghistory.channelsDelete(msghistoryId, channelId);
            return channelId;
        } catch {
            return rejectWithValue('Ошибка удаления канала');
        }
    }
);

// --- 6. Сформировать заявку ---
export const submitMsghistory = createAsyncThunk(
    'msghistory/submit',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.msghistory.formUpdate(id);
            return id;
        } catch {
            return rejectWithValue('Ошибка формирования заявки');
        }
    }
);

// --- 7. Удалить заявку ---
export const deleteMsghistory = createAsyncThunk(
    'msghistory/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.msghistory.msghistoryDelete(id);
            return id;
        } catch {
            return rejectWithValue('Ошибка удаления');
        }
    }
);

// --- 8. НОВОЕ: Решение модератора (Принять/Отклонить) ---
export const resolveMsghistory = createAsyncThunk(
    'msghistory/resolve',
    async ({ id, action }: { id: number; action: 'complete' | 'reject' }, { rejectWithValue }) => {
        try {
            await api.msghistory.resolveUpdate(id, { action });
            return { id, action };
        } catch { 
            // ИСПРАВЛЕНО: убрали (err), так как переменная не использовалась
            return rejectWithValue('Не удалось обновить статус заявки');
        }
    }
);

const msghistorySlice = createSlice({
    name: 'msghistory',
    initialState,
    reducers: {
        resetOperationSuccess: (state) => {
            state.operationSuccess = false;
        },
        clearCurrentMsghistory: (state) => {
            state.currentMsghistory = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Список (Short Polling: лоадер только если список пуст)
            .addCase(fetchMsghistoryList.pending, (state) => { 
                if (state.list.length === 0) state.loading = true; 
            })
            .addCase(fetchMsghistoryList.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload || []; 
            })
            
            // Детали
            .addCase(fetchMsghistoryById.pending, (state) => { state.loading = true; state.currentMsghistory = null; })
            .addCase(fetchMsghistoryById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentMsghistory = action.payload;
            })
            
            // Обновления (локально)
            .addCase(updateMsghistoryFields.fulfilled, (state, action) => {
                if (state.currentMsghistory) {
                    state.currentMsghistory = { ...state.currentMsghistory, ...action.payload };
                }
            })
            .addCase(updateChannelInMsghistory.fulfilled, (state, action) => {
                if (state.currentMsghistory && state.currentMsghistory.channels) {
                    const channel = state.currentMsghistory.channels.find(c => c.channel_id === action.payload.channelId);
                    if (channel) {
                        if (action.payload.data.repost_level !== undefined) channel.repost_level = action.payload.data.repost_level;
                        if (action.payload.data.views !== undefined) channel.views = action.payload.data.views;
                    }
                }
            })
            .addCase(removeChannelFromMsghistory.fulfilled, (state, action) => {
                if (state.currentMsghistory && state.currentMsghistory.channels) {
                    state.currentMsghistory.channels = state.currentMsghistory.channels.filter(c => c.channel_id !== action.payload);
                }
            })
            
            // Успех (Сформировать / Удалить)
            .addCase(submitMsghistory.fulfilled, (state) => { state.operationSuccess = true; })
            .addCase(deleteMsghistory.fulfilled, (state) => { state.operationSuccess = true; })

            // Решение модератора
            .addCase(resolveMsghistory.fulfilled, (state, action) => {
                state.operationSuccess = true;
                // Оптимистичное обновление
                if (state.currentMsghistory && state.currentMsghistory.id === action.payload.id) {
                    // 4 = Completed, 5 = Rejected
                    state.currentMsghistory.status = action.payload.action === 'complete' ? 4 : 5;
                }
            })
            
            // Сброс
            .addCase(logoutUser.fulfilled, () => initialState);
    }
});

export const { resetOperationSuccess, clearCurrentMsghistory } = msghistorySlice.actions;
export default msghistorySlice.reducer;