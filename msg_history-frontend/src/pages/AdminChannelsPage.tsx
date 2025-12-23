import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Card, Modal, Form, Spinner, Image, Badge, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
    fetchChannels, 
    deleteChannel, 
    createChannel, 
    updateChannel 
} from '../store/slices/channelsSlice';
import { PencilSquare, Trash, PlusLg, ArrowLeft, Image as ImageIcon } from 'react-bootstrap-icons';
import type { AppDispatch, RootState } from '../store';
import type { IChannel } from '../types';

const MINIO_BASE_URL = 'http://localhost:9000/images/tg_channels/';
const IMAGE_EXTENSION = '.png';

export const AdminChannelsPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    const { items, loading, actionLoading } = useSelector((state: RootState) => state.channels);
    
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    
    const [formData, setFormData] = useState({ title: '', text: '', subscribers: 0 });
    const [imageShortName, setImageShortName] = useState(''); 

    useEffect(() => {
        dispatch(fetchChannels(''));
    }, [dispatch]);

    const extractShortName = (fullUrl?: string) => {
        if (!fullUrl) return '';
        let name = fullUrl.replace(MINIO_BASE_URL, '');
        name = name.replace(IMAGE_EXTENSION, '');
        return name;
    };

    const handleOpenModal = (channel?: IChannel) => {
        if (channel) {
            setIsEditing(true);
            setSelectedId(channel.id);
            setFormData({
                title: channel.title,
                text: channel.text,
                subscribers: channel.subscribers || 0
            });
            setImageShortName(extractShortName(channel.image));
        } else {
            setIsEditing(false);
            setSelectedId(null);
            setFormData({ title: '', text: '', subscribers: 0 });
            setImageShortName('');
        }
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        await dispatch(deleteChannel(id));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();      
        try {
            const fullImageUrl = imageShortName.trim() 
                ? `${MINIO_BASE_URL}${imageShortName.trim()}${IMAGE_EXTENSION}`
                : undefined;
                
            const requestData = {
                ...formData,
                image: fullImageUrl 
            };

            if (isEditing && selectedId) {
                await dispatch(updateChannel({ 
                    id: selectedId, 
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    data: requestData as any
                })).unwrap();
            } else {
                await dispatch(createChannel(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    requestData as any
                )).unwrap();
            }

            setShowModal(false);
            dispatch(fetchChannels('')); 

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container className="pt-5 mt-5">
            {/* ШАПКА: 3 колонки (Лево - Центр - Право) */}
            <div className="d-flex align-items-center justify-content-between mb-4 position-relative">
                
                {/* 1. Кнопка Назад (Слева) */}
                <div style={{ flex: 1 }}> {/* Занимает место слева */}
                    <Button variant="outline-secondary" onClick={() => navigate('/channels')}>
                        <ArrowLeft className="me-2" /> Назад
                    </Button>
                </div>

                {/* 2. Заголовок (Строго по центру) */}
                <h2 className="fw-bold m-0 text-secondary text-center" style={{ flex: 2 }}>
                    Управление каналами
                </h2>
                
                {/* 3. Кнопка Добавить (Справа) */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button style={{ backgroundColor: '#24A1DE', border: 'none' }} onClick={() => handleOpenModal()}>
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
                                        <Button variant="light" size="sm" className="text-primary me-2" onClick={() => handleOpenModal(channel)}><PencilSquare size={18} /></Button>
                                        <Button variant="light" size="sm" className="text-danger" onClick={() => handleDelete(channel.id)}><Trash size={18} /></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Модальное окно */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
                <Modal.Header closeButton className="border-0"><Modal.Title>{isEditing ? 'Редактирование' : 'Новый канал'}</Modal.Title></Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold small text-muted">Название</Form.Label>
                            <Form.Control type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold small text-muted">Подписчики</Form.Label>
                            <Form.Control type="number" value={formData.subscribers} onChange={e => setFormData({...formData, subscribers: parseInt(e.target.value) || 0})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold small text-muted">Описание</Form.Label>
                            <Form.Control as="textarea" rows={3} value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} required />
                        </Form.Group>               
                        
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold small text-muted">Имя картинки (MinIO)</Form.Label>
                            <InputGroup>
                                <InputGroup.Text className="text-muted small" style={{fontSize: '0.8rem'}}>
                                    .../Images/
                                </InputGroup.Text>
                                <Form.Control 
                                    type="text" 
                                    placeholder="название (напр. logo1)" 
                                    value={imageShortName}
                                    onChange={e => setImageShortName(e.target.value)}
                                />
                                <InputGroup.Text className="text-muted small">
                                    {IMAGE_EXTENSION}
                                </InputGroup.Text>
                            </InputGroup>
                            <Form.Text className="text-muted" style={{fontSize: '0.75rem'}}>
                                Итоговый путь: {MINIO_BASE_URL}{imageShortName || '...'}{IMAGE_EXTENSION}
                            </Form.Text>
                        </Form.Group>                       
                    </Modal.Body>
                    <Modal.Footer className="border-0">
                        <Button variant="light" onClick={() => setShowModal(false)}>Отмена</Button>
                        <Button style={{ backgroundColor: '#24A1DE', border: 'none' }} type="submit" disabled={actionLoading}>
                            {actionLoading ? <Spinner size="sm" animation="border" /> : 'Сохранить'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};