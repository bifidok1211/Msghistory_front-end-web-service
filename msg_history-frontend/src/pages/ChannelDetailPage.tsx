import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChannelById, clearCurrentChannel } from '../store/slices/channelsSlice';
import type { AppDispatch, RootState } from '../store';
import { CustomBreadcrumbs } from '../components/Breadcrumbs';
import './styles/ChannelDetailPage.css';

export const DefaultImage = '/mock_images/default.png';

export const ChannelDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    
    // Только получение данных о канале
    const { currentChannel: channel, loading } = useSelector((state: RootState) => state.channels);

    useEffect(() => {
        if (id) {
            dispatch(fetchChannelById(id));
        }
        return () => {
            dispatch(clearCurrentChannel());
        };
    }, [id, dispatch]);

    if (loading) {
        return (
            <div className="loading-spinner">
                <p>Загрузка...</p>
            </div>
        );
    }

    if (!channel) {
        return (
            <div className="container" style={{ textAlign: 'center', marginTop: '40px' }}>
                <div className="page-title">Канал не найден</div>
                <Link to="/channels" className="card-button tg-btn">
                    Вернуться к списку
                </Link>
            </div>
        );
    }

    const breadcrumbs = [
        { label: 'Каналы', path: '/channels' },
        { label: channel.title, active: true },
    ];

    const displayImage = channel.image || DefaultImage;

    return (
        <>
            <div style={{ padding: '20px 0'}}>
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