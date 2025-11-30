import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getChannels, getCartBadge } from '../api/channelsApi';
import { setSearchTerm, selectSearchTerm } from '../store/slices/filterSlice';
import { dest_root } from '../config/tauri_config';
import type { AppDispatch } from '../store';
import type { IChannel, ICartBadge } from '../types';
import './styles/ChannelsListPage.css';

const DefaultImage = `${dest_root}mock_images/default.png`;

export const ChannelsListPage = () => {
  const [channels, setChannels] = useState<IChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartBadge, setCartBadge] = useState<ICartBadge>({ msghistory_id: null, count: 0 });

  const dispatch = useDispatch<AppDispatch>();
  const searchTerm = useSelector(selectSearchTerm);

  const fetchChannels = (filterTitle: string) => {
    setLoading(true);
    console.log('FETCH START', filterTitle);

    getChannels(filterTitle)
      .then(data => {
        console.log('FETCH DONE', data);
        if (Array.isArray(data.items)) {
          setChannels(data.items);
        } else {
          console.error('Получены неверные данные:', data);
          setChannels([]);
        }
      })
      .catch(err => {
        console.error('Failed to get channels:', err);
        setChannels([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchChannels(searchTerm);
    getCartBadge().then(cartData => {
      setCartBadge(cartData);
    });
  }, []);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetchChannels(searchTerm);
  };

  const isCartActive = cartBadge.count > 0 && cartBadge.msghistory_id !== null;

  return (
    <>
      <div className="page-title">Каналы</div>

      <div className="search-row">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            className="search-input"
            type="search"
            placeholder="Введите название канала для поиска..."
            value={searchTerm}
            onChange={e => dispatch(setSearchTerm(e.target.value))}
          />
        </form>

        {isCartActive ? (
          <a
            className="badge-icon"
            href={`/msghistory/${cartBadge.msghistory_id}`}
            aria-label="Составление заявки"
          >
            <span>{cartBadge.count}</span>
          </a>
        ) : (
          <a
            className="badge-icon"
            style={{ cursor: 'not-allowed' }}
            aria-label="Составление заявки"
          >
            <span></span>
          </a>
        )}
      </div>

      {loading ? (
        <div className="loading-spinner">
          <p>Загрузка...</p>
        </div>
      ) : (
        <div className="container channels-grid">
          {channels.map(channel => (
            <div key={channel.id} className="card card--vertical">
              <img
                className="card-img"
                src={channel.image || DefaultImage}
                alt={channel.title}
              />
              <div className="card-content">
                <p className="card-title">{channel.title}</p>

                <Link className="card-button tg-btn" to={`/channel/${channel.id}`}>
                  Подробнее
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
