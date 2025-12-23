import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import { CHANNELS_MOCK } from '../../api/mock'; 
import type { IChannel } from '../../types';
import type { DsChannelCreateRequest, DsChannelUpdateRequest } from '../../api/Api';

interface ChannelsState {
    items: IChannel[];
    total: number;
    currentChannel: IChannel | null;
    loading: boolean;
    error: string | null;
    actionLoading: boolean; // Добавлено поле для спиннера при действиях (создание, удаление и т.д.)
}

const initialState: ChannelsState = {
    items: [],
    total: 0,
    currentChannel: null,
    loading: false,
    error: null,
    actionLoading: false,
};

// --- Thunk: Получение списка каналов ---
export const fetchChannels = createAsyncThunk(
    'channels/fetchChannels',
    async (title: string, { rejectWithValue }) => {
        try {
            const response = await api.channels.channelsList({ title });
            
            const rawItems = response.data.items || [];
            
            // Маппинг данных из DTO в IChannel
            
            const mappedItems: IChannel[] = Array.isArray(rawItems) 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ? rawItems.map((item: any) => ({
                    id: item.id ?? 0,
                    title: item.title ?? 'Без названия',
                    text: item.text ?? '',
                    image: item.image ?? '',
                    subscribers: item.subscribers ?? 0,
                    status: item.status ?? false,
                }))
                : [];

            return {
                items: mappedItems,
                total: response.data.total || 0
            };
        } catch {
            return rejectWithValue('Backend unavailable');
        }
    }
);

// --- Thunk: Получение одного канала по ID ---
export const fetchChannelById = createAsyncThunk(
    'channels/fetchChannelById',
    async (id: string, { rejectWithValue }) => {
        try {
            const channelId = parseInt(id);
            const response = await api.channels.channelsDetail(channelId);
            
            const data = response.data;
            const mappedChannel: IChannel = {
                id: data.id ?? channelId,
                title: data.title ?? 'Без названия',
                text: data.text ?? '',
                image: data.image ?? '',
                subscribers: data.subscribers ?? 0,
                status: data.status ?? false
            };

            return mappedChannel;
        } catch {
            return rejectWithValue(id);
        }
    }
);

// 1. Создание канала
export const createChannel = createAsyncThunk(
    'channels/create',
    async (data: DsChannelCreateRequest, { rejectWithValue }) => {
        try {
            const response = await api.channels.channelsCreate(data);
            return response.data;
        } catch {
            return rejectWithValue('Ошибка создания канала');
        }
    }
);

// 2. Обновление канала
export const updateChannel = createAsyncThunk(
    'channels/update',
    async ({ id, data }: { id: number; data: DsChannelUpdateRequest }, { rejectWithValue }) => {
        try {
            const response = await api.channels.channelsUpdate(id, data);
            return response.data;
        } catch {
            return rejectWithValue('Ошибка обновления канала');
        }
    }
);

// 3. Удаление канала
export const deleteChannel = createAsyncThunk(
    'channels/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.channels.channelsDelete(id);
            return id;
        } catch {
            return rejectWithValue('Ошибка удаления канала');
        }
    }
);

// 4. Загрузка изображения канала
export const uploadChannelImage = createAsyncThunk(
    'channels/uploadImage',
    async ({ id, file }: { id: number; file: File }, { rejectWithValue }) => {
        try {
            await api.channels.imageCreate(id, { file });
            return id;
        } catch {
            return rejectWithValue('Ошибка загрузки изображения');
        }
    }
);


const channelsSlice = createSlice({
    name: 'channels',
    initialState,
    reducers: {
        clearCurrentChannel: (state) => {
            state.currentChannel = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // --- LIST ---
            .addCase(fetchChannels.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchChannels.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items; 
                state.total = action.payload.total;
            })
            .addCase(fetchChannels.rejected, (state, action) => {
                state.loading = false;
                state.error = 'Backend unavailable';
                console.warn('[Redux] Ошибка загрузки списка каналов. Используем моки.');
                
                const filterTitle = (action.meta.arg as string) || '';
                const filteredMockItems = CHANNELS_MOCK.items.filter(channel =>
                    channel.title.toLowerCase().includes(filterTitle.toLowerCase())
                );
                state.items = filteredMockItems;
                state.total = filteredMockItems.length;
            })

            // --- DETAIL ---
            .addCase(fetchChannelById.pending, (state) => {
                state.loading = true;
                state.currentChannel = null; 
            })
            .addCase(fetchChannelById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentChannel = action.payload;
            })
            .addCase(fetchChannelById.rejected, (state, action) => {
                state.loading = false;
                
                const idStr = action.meta.arg;
                const id = parseInt(idStr);
                console.log(`[Redux] Ошибка загрузки канала ID: ${id}. Ищем в моках...`);

                const channel = CHANNELS_MOCK.items.find(c => c.id === id);
                state.currentChannel = channel || null;
            })

            // --- CREATE ---
            .addCase(createChannel.pending, (state) => { state.actionLoading = true; })
            .addCase(createChannel.fulfilled, (state) => { state.actionLoading = false; })
            .addCase(createChannel.rejected, (state) => { state.actionLoading = false; })

            // --- UPDATE ---
            .addCase(updateChannel.pending, (state) => { state.actionLoading = true; })
            .addCase(updateChannel.fulfilled, (state) => { state.actionLoading = false; })
            .addCase(updateChannel.rejected, (state) => { state.actionLoading = false; })

            // --- DELETE ---
            .addCase(deleteChannel.pending, (state) => { state.actionLoading = true; })
            .addCase(deleteChannel.fulfilled, (state, action) => { 
                state.actionLoading = false;
                state.items = state.items.filter(item => item.id !== action.payload);
            })
            .addCase(deleteChannel.rejected, (state) => { state.actionLoading = false; })
            
            // --- UPLOAD IMAGE ---
            .addCase(uploadChannelImage.pending, (state) => { state.actionLoading = true; })
            .addCase(uploadChannelImage.fulfilled, (state) => { state.actionLoading = false; });
    },
});

export const { clearCurrentChannel } = channelsSlice.actions;
export default channelsSlice.reducer;