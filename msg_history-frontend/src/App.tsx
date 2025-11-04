import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AppNavbar } from './components/Navbar';
import { MsghistoryHomePage } from './pages/MsghistoryHomePage';
import { ChannelsListPage } from './pages/ChannelsListPage';
import { ChannelDetailPage } from './pages/ChannelDetailPage';

const MainLayout = () => (
    <>
        <AppNavbar />
        <main>
            <Outlet />
        </main>
    </>
);

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MsghistoryHomePage />} />
                <Route element={<MainLayout />}>
                    <Route path="/channels" element={<ChannelsListPage />} />
                    <Route path="/channel/:id" element={<ChannelDetailPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
