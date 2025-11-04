import { Link } from 'react-router-dom';
import type { IChannel } from '../types';
import './styles/ChannelCard.css';

export const DefaultImage = '/mock_images/default.png';

interface ChannelCardProps {
  channel: IChannel;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({ channel }) => {
  return (
    <div className="card card--vertical">
      <img 
        src={channel.image || DefaultImage} 
        alt={channel.title}
        className="card-img"
      />
      <div className="card-content">
        <h3 className="card-title">{channel.title}</h3>
        <Link to={`/channels/${channel.id}`} className="card-button">
          Перейти
        </Link>
      </div>
    </div>
  );
};