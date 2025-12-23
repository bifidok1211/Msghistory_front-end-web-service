import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChannels } from '../store/slices/channelsSlice';
import { fetchCartBadge, addChannelToDraft } from '../store/slices/cartSlice';
import { setSearchTerm, selectSearchTerm } from '../store/slices/filterSlice';
import type { AppDispatch, RootState } from '../store';
import { GearFill } from 'react-bootstrap-icons';
import './styles/ChannelsListPage.css';

const DefaultImage = `/mock_images/default.png`;

export const ChannelsListPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { items: channels, loading } = useSelector((state: RootState) => state.channels);
    const searchTerm = useSelector(selectSearchTerm);
    const [inputValue, setInputValue] = useState(searchTerm);

    const { msghistory_id, count } = useSelector((state: RootState) => state.cart);
    
    const { isAuthenticated, user } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        setInputValue(searchTerm);
    }, [searchTerm]);

    useEffect(() => {
        dispatch(fetchChannels(searchTerm));
        dispatch(fetchCartBadge());
    }, [dispatch, searchTerm]);

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        dispatch(setSearchTerm(inputValue));
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
                <form 
                    onSubmit={handleSearchSubmit} 
                    className="search-form" 
                    style={{ display: 'flex', gap: '10px', alignItems: 'center', flexGrow: 1 }}
                >
                    {/* 1. Кнопка Управление (СЛЕВА) */}
                    {user?.moderator && (
                        <button 
                            className="tg-btn"
                            onClick={() => navigate('/channels/manage')}
                            title="Управление каналами"
                            type="button" // Важно: type="button", чтобы не сабмитить форму поиска
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px', 
                                padding: '0 20px', 
                                height: '45px',
                                whiteSpace: 'nowrap',
                                minWidth: 'auto',
                                marginRight: '5px'
                            }}
                        >
                            <GearFill size={18} /> 
                            <span className="d-none d-md-inline">Управление</span>
                        </button>
                    )}

                    {/* 2. Инпут поиска (ПО ЦЕНТРУ, Растягивается) */}
                    <input 
                        className="search-input" 
                        type="search"
                        placeholder="Введите название канала для поиска..."
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)}
                        // Добавляем flex-grow, чтобы инпут занимал все доступное место между кнопкой и корзиной
                        style={{ flexGrow: 1, width: 'auto' }} 
                    />
                </form>

                {/* 3. Корзина (СПРАВА) */}
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
                    {channels.map(channel => (
                        <div key={channel.id} className="card card--vertical">
                            <img 
                                className="card-img" 
                                src={channel.image || DefaultImage} 
                                alt={channel.title}
                            />
                            <div className="card-content">
                                <p className="card-title">{channel.title}</p>
                                
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

                                    {isAuthenticated && (
                                        <button 
                                            className="card-button tg-btn"
                                            onClick={() => handleAdd(channel.id)}
                                            style={{ 
                                                backgroundColor: '#fff', 
                                                color: '#24A1DE', 
                                                border: '2px solid #24A1DE' 
                                            }}
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