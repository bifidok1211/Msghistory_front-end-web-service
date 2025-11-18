import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getChannelById } from '../api/channelsApi';
import {CustomBreadcrumbs} from '../components/Breadcrumbs'
import type { IChannel } from '../types';
import './styles/ChannelDetailPage.css';
import { dest_root } from '../config/tauri_config';


export const DefaultImage = `${dest_root}mock_images/default.png`;
export const ChannelDetailPage = () => {
    
    const { id } = useParams<{ id: string }>();
    const [channel, setChannel] = useState<IChannel | null>(null);
    const [loading, setLoading] = useState(true);
    const displayImage = channel?.image || DefaultImage;

    useEffect(() => {
        if (id) {
            setLoading(true);
            getChannelById(id)
                .then(data => setChannel(data))
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) {
        return (
            <div className="loading-spinner">
                <p>Загрузка...</p>
            </div>
        );
    }

    if (!channel) {
        return (
            <div className="container">
                <div className="page-title">Канал не найден</div>
                <Link to="/" className="card-button tg-btn">
                    Вернуться к списку
                </Link>
            </div>
        );
    }

    const breadcrumbs = [
        { label: 'Каналы', path: '/channels' },
        { label: channel.title, active: true },
    ];

    return (
        <>
            <div style={{ padding: '20px 0' }}>
                <CustomBreadcrumbs crumbs={breadcrumbs} />
            </div>

            <div className="page-title">{channel.title}</div>

            <div className="container">
                <div className="card card--onechannel">
                    <img className="card-img" src={displayImage} alt={channel.title} />

                    <div className="card-body">
                        <p className="card-text">{channel.text}</p>
                    </div>

                    <div className="card-footer">
                        <span className="card-name">{channel.title}</span>
                        {channel.subscribers && (
                            <span className="card-subs">
                                Количество подписчиков: {channel.subscribers}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};