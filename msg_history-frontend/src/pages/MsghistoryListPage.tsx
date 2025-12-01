import React, { useEffect, useState } from 'react';
import { Container, Table, Form, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMsghistoryList } from '../store/slices/msghistorySlice';
import type { AppDispatch, RootState } from '../store';
import { AppNavbar } from '../components/Navbar';

// Хелпер для статусов
const getStatusBadge = (status: number | undefined) => {
    switch (status) {
        case 1: return <Badge bg="secondary">Черновик</Badge>;
        case 2: return <Badge bg="dark">Удалена</Badge>;
        case 3: return <Badge style={{ backgroundColor: '#24A1DE' }}>Сформирована</Badge>;
        case 4: return <Badge bg="success">Завершена</Badge>;
        case 5: return <Badge bg="danger">Отклонена</Badge>;
        default: return <Badge bg="light" text="dark">Неизвестно</Badge>;
    }
};

export const MsghistoryListPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    const { list, loading } = useSelector((state: RootState) => state.msghistory);

    const [filters, setFilters] = useState({
        status: 'all',
        from: '',
        to: ''
    });

    useEffect(() => {
        dispatch(fetchMsghistoryList(filters));
    }, [dispatch, filters]);

    const handleRowClick = (id: number | undefined) => {
        if (id) navigate(`/msghistory/${id}`);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    // Стили для ограничения ширины контента (чтобы таблица и фильтры были одной ширины)
    const contentBlockStyle: React.CSSProperties = {
        width: '100%',
        maxWidth: '1000px', // Максимальная ширина контента
    };

    return (
        <>
            <AppNavbar />
            
            <div style={{ paddingTop: '90px', paddingBottom: '40px' }}>
                <Container className="d-flex flex-column align-items-center">
                    
                    {/* 1. Заголовок */}
                    <h2 
                        className="text-center fw-bold mb-4" 
                        style={{ color: '#000', fontFamily: '"Open Sans", Arial, sans-serif' }}
                    >
                        История заявок
                    </h2>

                    {/* 2. Панель фильтров */}
                    <div style={{
                        ...contentBlockStyle,
                        background: '#F5F5F5',
                        border: '1px solid #E1E5EA',
                        borderRadius: '12px',
                        boxShadow: '10px 10px 0 #D9D9D9',
                        padding: '20px',
                        marginBottom: '30px'
                    }}>
                        <Row className="g-3">
                            <Col md={4}>
                                <Form.Label className="fw-bold">Статус</Form.Label>
                                <Form.Select 
                                    name="status" 
                                    value={filters.status} 
                                    onChange={handleFilterChange}
                                    style={{ border: '1px solid #E1E5EA', borderRadius: '8px' }}
                                >
                                    <option value="all">Любой статус</option>
                                    <option value="1">Черновик</option>
                                    <option value="3">Сформирована</option>
                                    <option value="4">Завершена</option>
                                    <option value="5">Отклонена</option>
                                </Form.Select>
                            </Col>
                            <Col md={4}>
                                <Form.Label className="fw-bold">Дата создания (от)</Form.Label>
                                <Form.Control 
                                    type="date" 
                                    name="from" 
                                    value={filters.from} 
                                    onChange={handleFilterChange}
                                    style={{ border: '1px solid #E1E5EA', borderRadius: '8px' }}
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Label className="fw-bold">Дата создания (до)</Form.Label>
                                <Form.Control 
                                    type="date" 
                                    name="to" 
                                    value={filters.to} 
                                    onChange={handleFilterChange}
                                    style={{ border: '1px solid #E1E5EA', borderRadius: '8px' }}
                                />
                            </Col>
                        </Row>
                    </div>

                    {/* 3. Таблица или Загрузка */}
                    {loading ? (
                        <div className="text-center" style={{ marginTop: '20px' }}>
                            <Spinner animation="border" style={{ color: '#24A1DE' }} />
                            <p className="mt-2 text-muted">Загрузка списка...</p>
                        </div>
                    ) : (
                        <div 
                            className="table-responsive shadow-sm rounded" 
                            style={{ 
                                ...contentBlockStyle,
                                border: '1px solid #E1E5EA' 
                            }}
                        >
                            <Table hover className="align-middle mb-0 bg-white">
                                <thead style={{ backgroundColor: '#F2F4F6' }}>
                                    <tr>
                                        <th className="py-3 ps-4" style={{width: '60px'}}>#</th>
                                        <th className="py-3" style={{width: '150px'}}>Статус</th>                            
                                        <th className="py-3">Дата создания</th>
                                        <th className="py-3">Дата формирования</th> 
                                        <th className="py-3">Дата завершения</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(list || []).length > 0 ? (list || []).map((order) => (
                                        <tr 
                                            key={order.id} 
                                            onClick={() => handleRowClick(order.id)} 
                                            style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                                        >
                                            <td className="fw-bold ps-4 text-secondary">{order.id}</td>
                                            <td>{getStatusBadge(order.status)}</td>
                                            
                                            <td>
                                                {order.creation_date 
                                                    ? new Date(order.creation_date).toLocaleString('ru-RU') 
                                                    : <span className="text-muted">--</span>}
                                            </td>

                                            <td>
                                                {order.forming_date 
                                                    ? new Date(order.forming_date).toLocaleString('ru-RU') 
                                                    : <span className="text-muted">--</span>}
                                            </td>
                                            <td>
                                                {order.complition_date 
                                                    ? new Date(order.complition_date).toLocaleString('ru-RU') 
                                                    : <span className="text-muted">--</span>}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="text-center py-5 text-muted">
                                                Заявок не найдено
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Container>
            </div>
        </>
    );
};