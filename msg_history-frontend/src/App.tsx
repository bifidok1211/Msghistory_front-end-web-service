import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import React from 'react'; // Убедимся, что React импортирован

// Компоненты и страницы
import { AppNavbar } from './components/Navbar';
import { MsghistoryHomePage } from './pages/MsghistoryHomePage';
import { ChannelsListPage } from './pages/ChannelsListPage';
import { ChannelDetailPage } from './pages/ChannelDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { MsghistoryListPage } from './pages/MsghistoryListPage';
import { MsghistoryPage } from './pages/MsghistoryPage';
import { AdminChannelsPage } from './pages/AdminChannelsPage';
import { ForbiddenPage } from './pages/ForbiddenPage';
import { NotFoundPage } from './pages/NotFoundPage';
import {AdminChannelEditPage} from './pages/AdminChannelEditPage';

// Типы
import type { RootState } from './store';

// Обертка для защищенных маршрутов
// ИСПРАВЛЕНИЕ: Заменили JSX.Element на React.ReactNode
const ProtectedRoute = ({ children, onlyModerator = false }: { children: React.ReactNode, onlyModerator?: boolean }) => {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.user);

    // Если не авторизован — доступ запрещен
    if (!isAuthenticated) {
        return <ForbiddenPage />; 
    }

    // Если страница только для модераторов, а юзер не модератор — доступ запрещен
    if (onlyModerator && !user?.moderator) {
        return <ForbiddenPage />; 
    }

    return <>{children}</>; // Оборачиваем во фрагмент, так как ReactNode может быть текстом
};

const MainLayout = () => (
    <>
        <AppNavbar />
        <main>
            <Outlet />
        </main>
    </>
);

function App() {

    // При загрузке страницы удаляем токены из хранилища (сброс сессии по F5)
    useEffect(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                {/* Публичные страницы */}
                <Route path="/" element={<MsghistoryHomePage />} />
                <Route path="/login" element={<LoginPage />} />      
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Страница ошибки доступа */}
                <Route path="/forbidden" element={<ForbiddenPage />} />

                {/* Основной лейаут с Навбаром */}
                <Route element={<MainLayout />}>
                    {/* Публичные внутри приложения */}
                    <Route path="/channels" element={<ChannelsListPage />} />
                    <Route path="/channel/:id" element={<ChannelDetailPage />} />

                    {/* Защищенные маршруты (Требуют авторизации) */}
                    <Route 
                        path="/profile" 
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/msghistory" 
                        element={
                            <ProtectedRoute>
                                <MsghistoryListPage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/msghistory/:id" 
                        element={
                            <ProtectedRoute>
                                <MsghistoryPage />
                            </ProtectedRoute>
                        } 
                    />

                    {/* Маршрут ТОЛЬКО для модератора */}
                    <Route 
                        path="/channels/manage" 
                        element={
                            <ProtectedRoute onlyModerator={true}>
                                <AdminChannelsPage />
                            </ProtectedRoute>
                        } 
                    />
                </Route>
                <Route path="/channels/manage/new" element={<ProtectedRoute onlyModerator={true}><AdminChannelEditPage /></ProtectedRoute>} />
//    <Route path="/channels/manage/:id" element={<ProtectedRoute onlyModerator={true}><AdminChannelEditPage /></ProtectedRoute>} />


                {/* Обработка 404 */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;