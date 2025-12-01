import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'; // Добавили useState
import { useSelector, useDispatch } from 'react-redux';
import { fetchChannels } from '../store/slices/channelsSlice';
import { fetchCartBadge, addChannelToDraft } from '../store/slices/cartSlice';
import { setSearchTerm, selectSearchTerm } from '../store/slices/filterSlice';
import type { AppDispatch, RootState } from '../store';
import './styles/ChannelsListPage.css';

const DefaultImage = `/mock_images/default.png`;

export const ChannelsListPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // Данные каналов
    const { items: channels, loading } = useSelector((state: RootState) => state.channels);
    
    // Глобальный поисковый запрос (тот, по которому идет запрос к API)
    const searchTerm = useSelector(selectSearchTerm);
    
    // ЛОКАЛЬНОЕ состояние для инпута (то, что пользователь печатает прямо сейчас)
    const [inputValue, setInputValue] = useState(searchTerm);

    // Данные корзины
    const { msghistory_id, count } = useSelector((state: RootState) => state.cart);
    
    // Данные пользователя для проверки авторизации 
    const { isAuthenticated } = useSelector((state: RootState) => state.user);

    // Синхронизация: если searchTerm изменился извне (например, при очистке фильтров), обновляем инпут
    useEffect(() => {
        setInputValue(searchTerm);
    }, [searchTerm]);

    // Запрос данных идет только когда меняется searchTerm в Redux (т.е. после Submit)
    useEffect(() => {
        dispatch(fetchChannels(searchTerm));
        dispatch(fetchCartBadge());
    }, [dispatch, searchTerm]);

    // Обработка отправки формы (Enter)
    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Только здесь мы обновляем Redux, что вызывает useEffect и загрузку данных
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
                <form onSubmit={handleSearchSubmit} className="search-form">
                    <input 
                        className="search-input" 
                        type="search"
                        placeholder="Введите название канала для поиска..."
                        value={inputValue} // Привязали к локальному стейту
                        onChange={(e) => setInputValue(e.target.value)} // Обновляем только локальный стейт
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

                                    {/* Кнопка "Добавить" только для авторизованных */}
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