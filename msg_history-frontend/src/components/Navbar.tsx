import { Link } from 'react-router-dom';
import './styles/Navbar.css';

export const AppNavbar = () => {
    return (
        <header className="tg-header tg-header--with-link">
            <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
                <span className="logo-title">Telegram</span>
                <span className="logo-subtitle">Новая эра в общении</span>
            </Link>
            <Link to="/channels" className="header-link">
                Каналы
            </Link>
        </header>
    );
};