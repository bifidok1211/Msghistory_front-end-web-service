import { useEffect } from 'react';
import { Container, Table, Button, Card, Spinner, Image, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchChannels, deleteChannel } from '../store/slices/channelsSlice';
import { PencilSquare, Trash, PlusLg, Image as ImageIcon } from 'react-bootstrap-icons';
import type { AppDispatch, RootState } from '../store';
import { CustomBreadcrumbs } from '../components/Breadcrumbs';

export const AdminChannelsPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    const { items, loading } = useSelector((state: RootState) => state.channels);
    
    useEffect(() => {
        dispatch(fetchChannels(''));
    }, [dispatch]);

    const handleDelete = async (id: number) => {
        await dispatch(deleteChannel(id));
    };

    const crumbs = [
        { label: 'Каналы', path: '/channels' },
        { label: 'Управление', active: true }
    ];

    return (
        <Container className="pt-5 mt-5">
            {/* ШАПКА: Лево (Крошки) - Центр (Заголовок) - Право (Кнопка) */}
            <div className="d-flex align-items-center justify-content-between mb-4 position-relative">
                
                {/* 1. Хлебные крошки (Слева) */}
                <div style={{ flex: 1 }}>
                    <CustomBreadcrumbs crumbs={crumbs} />
                </div>

                {/* 2. Заголовок (Строго по центру) */}
                <h2 className="fw-bold m-0 text-secondary text-center" style={{ flex: 2 }}>
                    Управление каналами
                </h2>
                
                {/* 3. Кнопка Добавить (Справа) */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                        style={{ backgroundColor: '#24A1DE', border: 'none' }} 
                        onClick={() => navigate('/channels/manage/new')}
                    >
                        <PlusLg className="me-2" /> Добавить канал
                    </Button>
                </div>
            </div>

            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <Card.Body className="p-0">
                    <Table responsive hover className="m-0 align-middle">
                        <thead className="bg-light text-secondary small text-uppercase">
                            <tr>
                                <th className="ps-4 py-3">ID</th>
                                <th>Изображение</th>
                                <th>Название</th>
                                <th>Описание</th>
                                <th>Подписчики</th>
                                <th className="text-end pe-4">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-5"><Spinner animation="border" style={{ color: '#24A1DE' }} /></td></tr>
                            ) : items.map(channel => (
                                <tr key={channel.id} style={{ height: '80px' }}>
                                    <td className="ps-4 fw-bold text-muted">#{channel.id}</td>
                                    <td>
                                        <div className="rounded border d-flex align-items-center justify-content-center bg-light" style={{ width: 50, height: 50, overflow: 'hidden' }}>
                                            {channel.image ? (
                                                <Image src={channel.image} width={50} height={50} style={{objectFit: 'cover'}} onError={(e) => e.currentTarget.src = '/mock_images/default.png'} />
                                            ) : <ImageIcon className="text-muted" />}
                                        </div>
                                    </td>
                                    <td className="fw-semibold">{channel.title}</td>
                                    <td className="text-muted text-truncate" style={{maxWidth: 250}}>{channel.text}</td>
                                    <td><Badge bg="info" text="dark" pill>{channel.subscribers}</Badge></td>
                                    <td className="text-end pe-4">
                                        {/* Кнопка Редактировать - ведет на новую страницу */}
                                        <Button 
                                            variant="light" 
                                            size="sm" 
                                            className="text-primary me-2" 
                                            onClick={() => navigate(`/channels/manage/${channel.id}`)}
                                        >
                                            <PencilSquare size={18} />
                                        </Button>
                                        
                                        {/* Кнопка Удалить */}
                                        <Button 
                                            variant="light" 
                                            size="sm" 
                                            className="text-danger" 
                                            onClick={() => handleDelete(channel.id)}
                                        >
                                            <Trash size={18} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
};