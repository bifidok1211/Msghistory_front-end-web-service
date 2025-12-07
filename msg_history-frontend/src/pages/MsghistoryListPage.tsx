import React, { useEffect, useState } from 'react';
import { Container, Form, Row, Col, Badge, Spinner, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMsghistoryList } from '../store/slices/msghistorySlice';
import type { AppDispatch, RootState } from '../store';
import { AppNavbar } from '../components/Navbar';
import type { DsMsghistoryDTO } from '../api/Api';

const getStatusBadge = (status: number | undefined) => {
    switch (status) {
        case 2: return <Badge bg="dark">Удалена</Badge>;
        case 3: return <Badge style={{ backgroundColor: '#24A1DE' }}>Сформирована</Badge>;
        case 4: return <Badge bg="success">Завершена</Badge>;
        case 5: return <Badge bg="danger">Отклонена</Badge>;
        default: return <Badge bg="light" text="dark">Неизвестно</Badge>;
    }
};

const formatDateTime = (value?: string) => {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleString("ru-RU");
};

const getDefaultDateFilters = () => {
    const toISO = (d: Date) => d.toISOString().slice(0, 10);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    return {
        date_from: toISO(yesterday),
        date_to: toISO(today),
    };
};

export const MsghistoryListPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    const { list, loading } = useSelector((state: RootState) => state.msghistory);
    const defaultDates = getDefaultDateFilters();

    const [filters, setFilters] = useState({
        status: 'all',
        from: defaultDates.date_from,
        to: defaultDates.date_to
    });

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params: any = {};
        if (filters.status !== 'all') params.status = parseInt(filters.status);
        if (filters.from) params.from = filters.from;
        if (filters.to) params.to = filters.to;

        dispatch(fetchMsghistoryList(params));
    }, [filters, dispatch]);

    const handleCardClick = (id: number | undefined) => {
        if (id) navigate(`/msghistory/${id}`);
    };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFilterChange = (e: React.ChangeEvent<any>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const totalFound = list?.length ?? 0;

    // Стили для центральной колонки
    const contentBlockStyle: React.CSSProperties = {
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto', 
    };

    return (
        <>
            <AppNavbar />
            
            <div style={{ paddingTop: '90px', paddingBottom: '40px', backgroundColor: '#fff' }}>
                <Container className="d-flex flex-column align-items-center">
                    
                    {/* 1. Заголовок */}
                    <h2 className="text-center fw-bold mb-4" style={{ color: '#000', fontFamily: '"Open Sans", Arial, sans-serif' }}>
                        История заявок
                    </h2>

                    {/* 2. Панель фильтров */}
                    <div style={contentBlockStyle}>
                        <Card className="mb-4 border-0 shadow-sm" style={{ backgroundColor: '#F5F5F5', border: '1px solid #E1E5EA' }}>
                            <Card.Body>
                                <Row className="g-3">
                                    <Col md={4}>
                                        <Form.Label className="fw-bold">Статус</Form.Label>
                                        <Form.Select 
                                            name="status" 
                                            value={filters.status} 
                                            onChange={handleFilterChange}
                                            style={{ border: '1px solid #E1E5EA', borderRadius: '8px' }}
                                        >
                                            <option value="all">Все</option>
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
                            </Card.Body>
                        </Card>

                        {/* 3. Информация "Найдено" и "Период" */}
                        {!loading && (
                            <div className="d-flex justify-content-between align-items-center mb-4 px-1 w-100">
                                <div className="text-muted">
                                    Найдено заявок: <b>{totalFound}</b>
                                </div>
                                {(filters.from || filters.to) && (
                                    <small className="text-secondary">
                                        Период: {filters.from || "—"} — {filters.to || "—"}
                                    </small>
                                )}
                            </div>
                        )}

                        {/* 4. Контент */}
                        {loading ? (
                            <div className="text-center" style={{ marginTop: '40px' }}>
                                <Spinner animation="border" style={{ color: '#24A1DE' }} />
                                <p className="mt-2 text-muted">Загрузка списка...</p>
                            </div>
                        ) : totalFound > 0 ? (
                            <Row xs={1} md={2} lg={3} className="g-4">
                                {list.map((order: DsMsghistoryDTO) => {
                                    if (order.status === 1) return null;

                                    const created = formatDateTime(order.creation_date);
                                    const formed = formatDateTime(order.forming_date);
                                    const dateEnd = formatDateTime(order.complition_date);
                                    
                                    const displayDate = order.status === 4 || order.status === 5 ? dateEnd : formed;
                                    const dateLabel = order.status === 4 || order.status === 5 ? "Завершена:" : "Сформирована:";

                                    return (
                                        <Col key={order.id}>
                                            <Card 
                                                className="h-100 shadow-sm border-0 card-hover-effect"
                                                style={{ 
                                                    cursor: "pointer", 
                                                    backgroundColor: '#fff',
                                                    border: '1px solid #E1E5EA',
                                                    transition: 'transform 0.2s, box-shadow 0.2s'
                                                }}
                                                onClick={() => handleCardClick(order.id)}
                                            >
                                                <Card.Body className="d-flex flex-column">
                                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                                        <Card.Title className="mb-0 fw-bold" style={{ fontSize: '18px' }}>
                                                            Заявка №{order.id}
                                                        </Card.Title>
                                                        {getStatusBadge(order.status)}
                                                    </div>

                                                    <div className="small text-muted mb-3" style={{ fontSize: '13px' }}>
                                                        <div className="d-flex justify-content-between">
                                                            <span>Создана:</span>
                                                            <span className="text-dark">{created || "--"}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mt-1">
                                                            <span>{dateLabel}</span>
                                                            <span className="text-dark">{displayDate || "--"}</span>
                                                        </div>
                                                    </div>

                                                    <hr className="my-2 mt-auto" style={{ borderColor: '#E1E5EA' }} />

                                                    {/* Поля Охват и Коэффициент (всегда показываем, даже если 0) */}
                                                    <div className="mt-3">
                                                        <div className="d-flex justify-content-between mb-1" style={{ fontSize: '14px' }}>
                                                            <span className="text-muted">Охват:</span>
                                                            <b style={{ color: '#24A1DE' }}>
                                                                {(order.coverage || 0).toFixed(1)}%
                                                            </b>
                                                        </div>
                                                        <div className="d-flex justify-content-between" style={{ fontSize: '14px' }}>
                                                            <span className="text-muted">Коэффициент:</span>
                                                            <b style={{ color: '#24A1DE' }}>
                                                                {(order.coefficient || 0).toFixed(2)}
                                                            </b>
                                                        </div>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    );
                                })}
                            </Row>
                        ) : (
                            // Заглушка
                            <div className="text-center py-5 text-muted bg-light rounded-3 w-100">
                                Заявок не найдено за выбранный период
                            </div>
                        )}
                    </div>
                </Container>
            </div>
            
            <style>{`
                .card-hover-effect:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
                }
            `}</style>
        </>
    );
};