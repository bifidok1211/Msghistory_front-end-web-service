import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AppNavbar } from './components/Navbar';
import { MsghistoryHomePage } from './pages/MsghistoryHomePage.tsx';
import { ChannelsListPage } from './pages/ChannelsListPage.tsx';
import { ChannelDetailPage } from './pages/ChannelDetailPage.tsx';

const MainLayout = () => (
    <>
        <AppNavbar />
        <main>
            <Outlet />
        </main>
    </>
);

function App() {
    // Используем HashRouter для нативного приложения, чтобы избежать проблем с путями
    // basename не нужен, так как мы работаем в файловой системе или локальном протоколе
    return (
       <HashRouter> 
            <Routes>
                <Route path="/" element={<MsghistoryHomePage />} />
                <Route element={<MainLayout />}>
                    <Route path="/channels" element={<ChannelsListPage />} />
                    <Route path="/channel/:id" element={<ChannelDetailPage />} />
                </Route>
            </Routes>
        </HashRouter>
    );
}

export default App;