import React, { useEffect, useState } from 'react';
import { Container, Card, Form, Button, Spinner, InputGroup, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createChannel, updateChannel, fetchChannelById, clearCurrentChannel } from '../store/slices/channelsSlice';
import { Save, XCircle } from 'react-bootstrap-icons';
import type { AppDispatch, RootState } from '../store';
import { CustomBreadcrumbs } from '../components/Breadcrumbs';

const MINIO_BASE_URL = 'http://localhost:9000/images/tg_channels/';
const IMAGE_EXTENSION = '.png';

export const AdminChannelEditPage = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    const { currentChannel, actionLoading } = useSelector((state: RootState) => state.channels);
    const isEditing = !!id;

    const [formData, setFormData] = useState({ title: '', text: '', subscribers: 0 });
    const [imageShortName, setImageShortName] = useState(''); 

    // 1. При загрузке: если есть ID, грузим канал. Если нет - чистим стейт.
    useEffect(() => {
        if (isEditing && id) {
            dispatch(fetchChannelById(id));
        } else {
            dispatch(clearCurrentChannel());
            setFormData({ title: '', text: '', subscribers: 0 });
            setImageShortName('');
        }
    }, [id, isEditing, dispatch]);

    // 2. Когда данные канала загрузились, заполняем форму
    useEffect(() => {
        if (isEditing && currentChannel) {
            setFormData({
                title: currentChannel.title,
                text: currentChannel.text,
                subscribers: currentChannel.subscribers || 0
            });
            const img = currentChannel.image || '';
            // Пытаемся вытащить короткое имя из полного URL
            setImageShortName(img.replace(MINIO_BASE_URL, '').replace(IMAGE_EXTENSION, ''));
        }
    }, [currentChannel, isEditing]);

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

            if (isEditing && id) {
                await dispatch(updateChannel({ 
                    id: parseInt(id), 
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    data: requestData as any
                })).unwrap();
            } else {
                await dispatch(createChannel(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    requestData as any
                )).unwrap();
            }
            // После успеха возвращаемся к списку
            navigate('/channels/manage');
        } catch (error) {
            console.error(error);
        }
    };

    const crumbs = [
        { label: 'Каналы', path: '/channels' },
        { label: 'Управление', path: '/channels/manage' },
        { label: isEditing ? `Редактирование #${id}` : 'Создание канала', active: true }
    ];

    return (
        <Container className="pt-5 mt-5">
            <div className="mb-4">
                <CustomBreadcrumbs crumbs={crumbs} />
            </div>

            <Row className="justify-content-center">
                <Col lg={8}>
                    <Card className="border-0 shadow-sm rounded-4">
                        <Card.Header className="bg-white border-bottom-0 pt-4 pb-0 px-4">
                            <h3 className="fw-bold m-0 text-dark">
                                {isEditing ? 'Редактирование канала' : 'Новый канал'}
                            </h3>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Form onSubmit={handleSubmit}>
                                <Row className="g-3">
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold small text-muted">Название канала</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                size="lg"
                                                value={formData.title} 
                                                onChange={e => setFormData({...formData, title: e.target.value})} 
                                                required 
                                                placeholder="Введите название..."
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold small text-muted">Описание</Form.Label>
                                            <Form.Control 
                                                as="textarea" 
                                                rows={4} 
                                                value={formData.text} 
                                                onChange={e => setFormData({...formData, text: e.target.value})} 
                                                required 
                                                placeholder="Подробное описание канала..."
                                                style={{ resize: 'none' }}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold small text-muted">Количество подписчиков</Form.Label>
                                            <Form.Control 
                                                type="number" 
                                                value={formData.subscribers} 
                                                onChange={e => setFormData({...formData, subscribers: parseInt(e.target.value) || 0})} 
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold small text-muted">Имя картинки (MinIO)</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text className="text-muted small">../Images/</InputGroup.Text>
                                                <Form.Control 
                                                    type="text" 
                                                    value={imageShortName}
                                                    onChange={e => setImageShortName(e.target.value)}
                                                    placeholder="logo1"
                                                />
                                                <InputGroup.Text className="text-muted small">.png</InputGroup.Text>
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="d-flex justify-content-end gap-3 mt-4 pt-2 border-top">
                                    <Button 
                                        variant="light" 
                                        onClick={() => navigate('/channels/manage')}
                                        className="d-flex align-items-center"
                                    >
                                        <XCircle className="me-2"/> Отмена
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        disabled={actionLoading}
                                        className="d-flex align-items-center"
                                        style={{ backgroundColor: '#24A1DE', border: 'none', padding: '10px 30px' }}
                                    >
                                        {actionLoading ? <Spinner size="sm" animation="border" /> : (
                                            <>
                                                <Save className="me-2"/> Сохранить
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};