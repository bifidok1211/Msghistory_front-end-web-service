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
    
    // Получаем данные: авторизован ли юзер и есть ли у него ID черновика
    const { isAuthenticated, user } = useSelector((state: RootState) => state.user);
    const { msghistory_id } = useSelector((state: RootState) => state.cart);

    const handleLogout = async () => {
        // 1. Если есть активный черновик (ID не null), пробуем его удалить (сменить статус на удален)
        if (msghistory_id) {
            try {
                // Ждем выполнения запроса на удаление
                await dispatch(deleteMsghistory(msghistory_id)).unwrap();
                console.log(`Черновик ${msghistory_id} был помечен как удаленный.`);
            } catch (e) {
                // Если ошибка (например, сеть упала или токен протух), просто логируем,
                // но не останавливаем выход пользователя
                console.warn("Не удалось удалить черновик при выходе:", e);
            }
        }
        
        // 2. Выполняем выход (очистка токена, сброс стейта)
        dispatch(logoutUser())
            .then(() => {
                // 3. Обновляем бейдж (он станет 0/null)
                dispatch(fetchCartBadge());
                // 4. Перенаправляем на логин
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