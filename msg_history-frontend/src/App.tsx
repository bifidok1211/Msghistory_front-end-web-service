import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AppNavbar } from './components/Navbar';
import { MsghistoryHomePage } from './pages/MsghistoryHomePage.tsx';
import { ChannelsListPage } from './pages/ChannelsListPage.tsx';
import { ChannelDetailPage } from './pages/ChannelDetailPage.tsx';
import { dest_root } from './config/tauri_config';



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
       <BrowserRouter basename={dest_root}> 
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