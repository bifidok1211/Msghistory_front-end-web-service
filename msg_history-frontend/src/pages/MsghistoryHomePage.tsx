import { AppNavbar } from '../components/Navbar';
import './styles/MsghistoryHomePage.css';

export const MsghistoryHomePage = () => {
  return (
    <>
      <AppNavbar />
      <div className="home-container">
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
