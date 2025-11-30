import { AppNavbar } from '../components/Navbar';
import { dest_root } from '../config/tauri_config';
import './styles/MsghistoryHomePage.css';



export const MsghistoryHomePage = () => {
    return (
        <>
            <AppNavbar />
                <div className="home-container">
                <video autoPlay loop muted playsInline className="home-video-background">
                    <source src={`${dest_root}background/Background.mp4`} type="video/mp4" />
                    Ваш браузер не поддерживает видео-тег.
                </video>
                <div className="home-content">
                    <h1 className="page-title">История пересылки поста в каналах.</h1>
                    <p className="home-description">
                    Сервис предназначен для количественного анализа публикаций в Telegram-каналах.
                    </p>
                </div>
            </div>
        </>
    );
};