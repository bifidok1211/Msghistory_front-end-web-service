import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addChannelToDraft } from '../store/slices/cartSlice';
import type { RootState, AppDispatch } from '../store';
import type { IChannel } from '../types';
import './styles/ChannelCard.css';

export const DefaultImage = '/mock_images/default.png';

interface ChannelCardProps {
  channel: IChannel;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({ channel }) => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  const handleAdd = () => {
      if (channel.id) {
          dispatch(addChannelToDraft(channel.id));
      }
  };

  return (
    <div className="card card--vertical">
      <img 
        src={channel.image || DefaultImage} 
        alt={channel.title}
        className="card-img"
      />
      <div className="card-content">
        <h3 className="card-title">{channel.title}</h3>
        
        {/* Кнопка перехода к деталям (Твой дизайн) */}
        <Link to={`/channel/${channel.id}`} className="card-button">
          Перейти
        </Link>

        {/* Кнопка добавления (Функционал образца) */}
        {/* Добавляем только если авторизован. Стилизуем под твой дизайн (outline версия), 
            чтобы кнопки визуально не сливались, но сохраняли стиль */}
        {isAuthenticated && (
            <button 
                onClick={handleAdd}
                className="card-button"
                // style={{ 
                //     marginTop: '8px', 
                //     backgroundColor: '#fff', 
                //     color: '#24A1DE', 
                //     border: '2px solid #24A1DE',
                //     lineHeight: '39px' // Чуть меньше из-за бордера
                // }}
            >
                Добавить
            </button>
        )}
      </div>
    </div>
  );
};