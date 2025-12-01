import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChannels } from '../store/slices/channelsSlice';
import { fetchCartBadge, addChannelToDraft } from '../store/slices/cartSlice'; // Добавили экшен добавления
import { setSearchTerm, selectSearchTerm } from '../store/slices/filterSlice';
import type { AppDispatch, RootState } from '../store';
import './styles/ChannelsListPage.css';

const DefaultImage = `/mock_images/default.png`;

export const ChannelsListPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // Данные каналов и поиска
    const { items: channels, loading } = useSelector((state: RootState) => state.channels);
    const searchTerm = useSelector(selectSearchTerm);
    
    // Данные корзины
    const { msghistory_id, count } = useSelector((state: RootState) => state.cart);
    
    // Данные пользователя для проверки авторизации 
    const { isAuthenticated } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        dispatch(fetchChannels(searchTerm));
        dispatch(fetchCartBadge());
    }, [dispatch, searchTerm]);

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        dispatch(fetchChannels(searchTerm));
    };

    const handleCartClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (msghistory_id) {
            navigate(`/msghistory/${msghistory_id}`);
        }
    };

    
    const handleAdd = (channelId: number) => {
        dispatch(addChannelToDraft(channelId));
    };

    const isCartActive = count > 0 && msghistory_id !== null;

    return (
        <>
            <div className="page-title">Каналы</div>

            <div className="search-row">
                <form onSubmit={handleSearchSubmit} className="search-form">
                    <input 
                        className="search-input" 
                        type="search"
                        placeholder="Введите название канала для поиска..."
                        value={searchTerm}
                        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                    />
                </form>

                {isCartActive ? (
                    <a 
                        className="badge-icon" 
                        href="#"
                        onClick={handleCartClick}
                        aria-label="Составление заявки"
                    >
                        <span>{count}</span>
                    </a>
                ) : (
                    <a 
                        className="badge-icon" 
                        style={{ cursor: 'not-allowed', opacity: 0.5 }} 
                        aria-label="Составление заявки"
                    >
                        <span></span>
                    </a>
                )}
            </div>

            {loading ? (
                <div className="loading-spinner">
                    <p>Загрузка...</p>
                </div>
            ) : (
                <div className="container channels-grid">
                    {/* Рендеринг всех карточек сразу, сохраняя твой дизайн */}
                    {channels.map(channel => (
                        <div key={channel.id} className="card card--vertical">
                            <img 
                                className="card-img" 
                                src={channel.image || DefaultImage} 
                                alt={channel.title}
                            />
                            <div className="card-content">
                                <p className="card-title">{channel.title}</p>
                                
                                {/* Блок кнопок */}
                                <div style={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    gap: '10px', 
                                    width: '100%', 
                                    alignItems: 'center',
                                    marginTop: 'auto' 
                                }}>
                                    <Link 
                                        className="card-button tg-btn" 
                                        to={`/channel/${channel.id}`}
                                    >
                                        Подробнее
                                    </Link>

                                    {/* Логика из образца FactorCard: кнопка "Добавить" только для авторизованных */}
                                    {isAuthenticated && (
                                        <button 
                                            className="card-button tg-btn"
                                            onClick={() => handleAdd(channel.id)}
                                        >
                                            Добавить
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};