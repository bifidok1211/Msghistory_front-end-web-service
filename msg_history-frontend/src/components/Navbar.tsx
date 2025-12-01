import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/userSlice';
import { deleteMsghistory } from '../store/slices/msghistorySlice'; 
import { fetchCartBadge } from '../store/slices/cartSlice';
import type { RootState, AppDispatch } from '../store';
import './styles/Navbar.css';

export const AppNavbar = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    // Получаем данные из Redux
    const { isAuthenticated, user } = useSelector((state: RootState) => state.user);
    const { msghistory_id } = useSelector((state: RootState) => state.cart);

    const handleLogout = async () => {
        // Если есть активный черновик, удаляем его при выходе (логика из образца)
        if (msghistory_id) {
            try {
                await dispatch(deleteMsghistory(msghistory_id)).unwrap();
                console.log(`Черновик ${msghistory_id} был автоматически удален при выходе.`);
            } catch (e) {
                console.error("Не удалось удалить черновик при выходе", e);
            }
        }
        
        // Выход из системы
        dispatch(logoutUser())
            .then(() => {
                dispatch(fetchCartBadge());
                navigate('/login'); // В образце был редирект на логин
            });
    };

    return (
        <header className="tg-header tg-header--with-link">
            {/* Логотип (Твой дизайн) */}
            <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
                <span className="logo-title">Telegram</span>
                <span className="logo-subtitle">Новая эра в общении</span>
            </Link>

            {/* Навигация */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <Link to="/channels" className="header-link">
                    Каналы
                </Link>

                {isAuthenticated ? (
                    <>
                        <Link to="/msghistory" className="header-link">
                            Мои заявки
                        </Link>

                        <div style={{ width: '1px', height: '24px', background: '#e0e0e0' }}></div>

                        <Link to="/profile" className="header-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {/* Можно добавить иконку, если нужно */}
                            <span>{user?.username || user?.full_name || 'Пользователь'}</span>
                        </Link>

                        <button 
                            onClick={handleLogout} 
                            className="header-link" 
                            style={{ 
                                background: 'none', 
                                border: 'none', 
                                cursor: 'pointer', 
                                padding: 0,
                                color: '#000000ff' // Слегка красноватый для выхода, или можно оставить черным
                            }}
                        >
                            Выход
                        </button>
                    </>
                ) : (
                    <>
                        <div style={{ width: '1px', height: '24px', background: '#e0e0e0' }}></div>
                        
                        <Link to="/login" className="header-link">
                            Вход
                        </Link>
                        
                        <Link to="/register" className="header-link" style={{ color: '#24A1DE' }}>
                            Регистрация
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
};