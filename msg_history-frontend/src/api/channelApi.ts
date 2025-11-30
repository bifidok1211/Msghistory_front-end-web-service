import type { IPaginatedChannels, IChannel, ICartBadge} from '../types';
import { CHANNELS_MOCK } from './mock';

const isTauri = import.meta.env.VITE_TARGET === 'tauri';
const BACKEND_IP = 'http://10.11.207.23:8090'; 
const API_PREFIX = isTauri ? `${BACKEND_IP}/api` : '/api';

const MINIO_IP = 'http://10.11.207.23:9000'; 
export const IMAGE_BASE_URL = isTauri ? `${MINIO_IP}/images/tg_channels` : 'http://localhost:9000/images/tg_channels';




// Получение списка каналов с фильтраией по названию
export const getChannels = async (title: string): Promise<IPaginatedChannels> => {
    const url = title 
        ? `${API_PREFIX}/channels?title=${encodeURIComponent(title)}`
        : `${API_PREFIX}/channels`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Backend is not available');
        }
    const data = await response.json();
    return {
        items: data.items || [],
        total: data.total || 0
    };
    } catch (error) {
        console.warn('Failed to fetch from backend, using mock data.', error);
        const filteredMockItems = CHANNELS_MOCK.items.filter(channel =>
            channel.title.toLowerCase().includes(title.toLowerCase())
        );
        return { items: filteredMockItems, total: filteredMockItems.length };
    }
};

// Получение одного канала по ID
export const getChannelById = async (id: string): Promise<IChannel | null> => {
    try {
        const response = await fetch(`${API_PREFIX}/channels/${id}`);
        if (!response.ok) {
            throw new Error('Backend is not available');
        }
        return await response.json();
    } catch (error) {
        console.warn(`Failed to fetch channel ${id}, using mock data.`, error);
        const channel = CHANNELS_MOCK.items.find(f => f.id === parseInt(id));
        return channel || null;
    }
};

// Получение корзины
export const getCartBadge = async (): Promise<ICartBadge> => {
    try {
        const token = localStorage.getItem('authToken'); 
        if (!token) {
            throw new Error('No auth token found');
        }

        const response = await fetch(`${API_PREFIX}/msghistory/channelscart`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch cart data');
        }
        return await response.json();

    } catch (error) {
        console.warn('Could not fetch cart data, assuming cart is empty.', error);
        return { msghistory_id: null, count: 0 };
    }
};