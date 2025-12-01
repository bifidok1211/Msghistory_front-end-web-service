import { AppNavbar } from '../components/Navbar';
import './styles/MsghistoryHomePage.css';

// Картинки из public/background (поправь пути, если нужно)
const slides = [
  '/background/pic1.jpeg',
  '/background/pic2.png',
  '/background/pic3.png',
];

export const MsghistoryHomePage = () => {
  return (
    <>
      <AppNavbar />

      <div className="home-shell">
        {/* Фоновая карусель */}
        <div
          id="homeBgCarousel"
          className="carousel slide carousel-fade home-bg-carousel"
          data-bs-ride="carousel"
          data-bs-interval="7000"
        >
          <div className="carousel-inner">
            {slides.map((src, index) => (
              <div
                key={src}
                className={`carousel-item ${index === 0 ? 'active' : ''}`}
              >
                <img
                  src={src}
                  className="d-block home-bg-image"
                  alt={`Слайд ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Текст поверх карусели */}
        <div className="home-overlay">
            <h1 className="home-title">
              История пересылки поста в каналах.
            </h1>
            <p className="home-lead">
              Сервис предназначен для количественного анализа публикаций
              в Telegram-каналах.
            </p>
        </div>
      </div>
    </>
  );
};
