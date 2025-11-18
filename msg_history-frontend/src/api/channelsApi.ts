import { dest_api, dest_img } from '../config/tauri_config';
import type { IPaginatedChannels, IChannel, ICartBadge} from '../types';
import { CHANNELS_MOCK } from './mock';



const resolveImageUrls = (channels: IChannel[]): IChannel[] => {
    return channels.map(channel => ({
        ...channel,
        image: channel.image ? `${dest_img}${channel.image}` : undefined
    }));
};

export const getChannels = async (title: string): Promise<IPaginatedChannels> => {

    const url = `${dest_api}/channels${title ? `?title=${encodeURIComponent(title)}` : ''}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Backend is not available');
        const data = await response.json();
        return {
            items: resolveImageUrls(data.items || []),
            total: data.total || 0
        };
    } catch (error) {
        console.warn('Failed to fetch from backend, using mock data.', error);
        const filtered = CHANNELS_MOCK.items.filter(f =>
            f.title.toLowerCase().includes(title.toLowerCase())
        );
        return { items: filtered, total: filtered.length };
    }
};

export const getChannelById = async (id: string): Promise<IChannel | null> => {

    const url = `${dest_api}/channels/${id}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Backend not available');
        const channel = await response.json();
        if (channel && channel.image) {
            channel.image = `${dest_img}${channel.image}`;
        }
        return channel;
    } catch (error) {
        console.warn(`Failed to fetch channel ${id}, using mock data.`, error);
        return CHANNELS_MOCK.items.find(f => f.id === parseInt(id)) || null;
    }
};

export const getCartBadge = async (): Promise<ICartBadge> => {

    const url = `${dest_api}/msghistory/channelscart`;

    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No auth token found');

        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch cart data');
        return await response.json();
    } catch (error) {
        console.warn('Could not fetch cart data, assuming cart is empty.', error);
        return { msghistory_id: null, count: 0 };
    }
};


