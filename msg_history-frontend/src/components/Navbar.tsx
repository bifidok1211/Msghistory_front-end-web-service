import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/userSlice';
import { deleteMsghistory } from '../store/slices/msghistorySlice'; 
import { fetchCartBadge } from '../store/slices/cartSlice';
import type { RootState, AppDispatch } from '../store';
import { GearFill } from 'react-bootstrap-icons'; // Импортируем иконку
import './styles/Navbar.css';

export const AppNavbar = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    // Получаем данные
    const { isAuthenticated, user } = useSelector((state: RootState) => state.user);
    const { msghistory_id } = useSelector((state: RootState) => state.cart);

    const handleLogout = async () => {
        if (msghistory_id) {
            try {
                await dispatch(deleteMsghistory(msghistory_id)).unwrap();
            } catch (e) {
                console.warn("Не удалось удалить черновик при выходе:", e);
            }
        }
        
        dispatch(logoutUser())
            .then(() => {
                dispatch(fetchCartBadge());
                navigate('/login');
            });
    };

    return (
        <header className="tg-header tg-header--with-link">
            <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
                <span className="logo-title">Telegram</span>
                <span className="logo-subtitle">Новая эра в общении</span>
            </Link>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Link to="/channels" className="header-link">
                    Каналы
                </Link>

                {isAuthenticated ? (
                    <>
                        <Link to="/msghistory" className="header-link">
                            Мои заявки
                        </Link>

                        {/* Кнопка Управление (только для модератора) */}
                        {user?.moderator && (
                            <Link 
                                to="/channels/manage" 
                                className="header-link" 
                                style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                                title="Управление каналами"
                            >
                                <GearFill size={16} />
                                {/* На мобильных можно скрывать текст, оставив иконку, но пока оставим так */}
                                <span>Управление</span>
                            </Link>
                        )}
                        
                        <div style={{ borderLeft: '1px solid #ccc', height: '24px' }}></div>

                        <Link to="/profile" className="header-link">
                            {user?.username || 'Профиль'}
                        </Link>

                        <button 
                            onClick={handleLogout} 
                            className="header-link" 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#030303ff' }}
                        >
                            Выход
                        </button>
                    </>
                ) : (
                    <>
                        <div style={{ borderLeft: '1px solid #ccc', height: '24px' }}></div>
                        <Link to="/login" className="header-link">Вход</Link>
                        <Link to="/register" className="header-link">Регистрация</Link>
                    </>
                )}
            </div>
        </header>
    );
};