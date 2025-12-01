import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AppNavbar } from './components/Navbar';
import { MsghistoryHomePage } from './pages/MsghistoryHomePage';
import { ChannelsListPage } from './pages/ChannelsListPage';
import { ChannelDetailPage } from './pages/ChannelDetailPage';
import { useEffect } from 'react';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { MsghistoryListPage } from './pages/MsghistoryListPage';
import { MsghistoryPage } from './pages/MsghistoryPage';

const MainLayout = () => (
    <>
        <AppNavbar />
        <main>
            <Outlet />
        </main>
    </>
);

function App() {

    useEffect(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MsghistoryHomePage />} />
                <Route path="/login" element={<LoginPage />} />      
                <Route path="/register" element={<RegisterPage />} />  
                <Route element={<MainLayout />}>
                    <Route path="/channels" element={<ChannelsListPage />} />
                    <Route path="/channel/:id" element={<ChannelDetailPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/msghistory" element={<MsghistoryListPage />} />
                    <Route path="/msghistory/:id" element={<MsghistoryPage />} /> 
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
