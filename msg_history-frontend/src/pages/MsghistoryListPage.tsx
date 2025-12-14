import React, { useEffect, useState, useMemo } from 'react';
import { Container, Form, Row, Col, Badge, Spinner, Card, ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMsghistoryList } from '../store/slices/msghistorySlice';
import type { AppDispatch, RootState } from '../store';
import { AppNavbar } from '../components/Navbar';
import type { DsMsghistoryDTO } from '../api/Api';
import { ExclamationCircleFill, PersonFill } from 'react-bootstrap-icons';

const STATUS_FORMED = 3;

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
    const { user } = useSelector((state: RootState) => state.user);
    
    const defaultDates = getDefaultDateFilters();

    const [filters, setFilters] = useState({
        status: 'all',
        from: defaultDates.date_from,
        to: defaultDates.date_to
    });

    const [selectedCreatorId, setSelectedCreatorId] = useState<number | 'all'>('all');

    useEffect(() => {
        const loadData = () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const params: any = {};
            if (filters.status !== 'all') params.status = parseInt(filters.status);
            if (filters.from) params.from = filters.from;
            if (filters.to) params.to = filters.to;
            dispatch(fetchMsghistoryList(params));
        };

        loadData();
        const intervalId = setInterval(loadData, 5000);
        return () => clearInterval(intervalId);
    }, [filters, dispatch]);

    const creatorsStats = useMemo(() => {
        if (!list) return [];
        const stats = new Map<number, { countFormed: number, total: number, name: string }>();

        list.forEach(order => {
            if (order.status === 1) return;
            const creatorId = order.creator_login || 0; 
            const creatorName = `Пользователь #${creatorId}`; 

            if (!stats.has(creatorId)) {
                stats.set(creatorId, { countFormed: 0, total: 0, name: creatorName });
            }
            
            const stat = stats.get(creatorId)!;
            stat.total += 1;
            if (order.status === STATUS_FORMED) {
                stat.countFormed += 1;
            }
        });
        return Array.from(stats.entries()).map(([id, data]) => ({ id, ...data }));
    }, [list]);

    const displayedList = useMemo(() => {
        if (!list) return [];
        let filtered = list.filter(order => order.status !== 1);

        if (user?.moderator && selectedCreatorId !== 'all') {
            filtered = filtered.filter(order => order.creator_login === selectedCreatorId);
        }
        return filtered;
    }, [list, user?.moderator, selectedCreatorId]);

    const handleCardClick = (id: number | undefined) => {
        if (id) navigate(`/msghistory/${id}`);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFilterChange = (e: React.ChangeEvent<any>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const isModerator = !!user?.moderator;

    return (
        <>
            <AppNavbar />
            
            <div style={{ paddingTop: '90px', paddingBottom: '40px', backgroundColor: '#fff' }}>
                {/* Используем fluid, но для обычного юзера ограничиваем ширину внутри через Row */}
                <Container fluid> 
                    <h2 className="text-center fw-bold mb-4" style={{ color: '#000', fontFamily: '"Open Sans", Arial, sans-serif' }}>
                        {isModerator ? 'История заявок' : 'История заявок'}
                    </h2>

                    <Row className={isModerator ? "" : "justify-content-center"}>
                        
                        {/* ЛЕВАЯ КОЛОНКА (Только модератор) */}
                        {isModerator && (
                            <Col lg={3} className="mb-4">
                                <Card className="shadow-sm border-0 h-100" style={{ border: '1px solid #E1E5EA' }}>
                                    <Card.Header className="bg-white fw-bold d-flex align-items-center gap-2" style={{ borderBottom: '1px solid #E1E5EA' }}>
                                        <PersonFill /> Пользователи
                                    </Card.Header>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item 
                                            action 
                                            active={selectedCreatorId === 'all'}
                                            onClick={() => setSelectedCreatorId('all')}
                                            className="d-flex justify-content-between align-items-center"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <span>Все пользователи</span>
                                            <Badge bg="secondary" pill>{list.filter(o => o.status !== 1).length}</Badge>
                                        </ListGroup.Item>
                                        
                                        {creatorsStats.map(creator => (
                                            <ListGroup.Item 
                                                key={creator.id}
                                                action
                                                active={selectedCreatorId === creator.id}
                                                onClick={() => setSelectedCreatorId(creator.id)}
                                                className="d-flex justify-content-between align-items-center"
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <span>{creator.name}</span>
                                                <div className="d-flex gap-2 align-items-center">
                                                    {creator.countFormed > 0 && (
                                                        <ExclamationCircleFill className="text-warning" title="Есть необработанные заявки" />
                                                    )}
                                                    <Badge bg="light" text="dark" pill>{creator.total}</Badge>
                                                </div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </Card>
                            </Col>
                        )}

                        {/* ПРАВАЯ/ЦЕНТРАЛЬНАЯ КОЛОНКА */}
                        <Col lg={isModerator ? 9 : 10} xl={isModerator ? 9 : 8}> {/* <-- ИСПРАВЛЕНИЕ: Ограничиваем ширину для юзера */}
                            
                            {/* Фильтры */}
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

                            {/* Информация */}
                            {!loading && (
                                <div className="d-flex justify-content-between align-items-center mb-4 px-1 w-100">
                                    <div className="text-muted">
                                        Найдено заявок: <b>{displayedList.length}</b>
                                    </div>
                                </div>
                            )}

                            {/* Контент */}
                            {loading && displayedList.length === 0 ? (
                                <div className="text-center" style={{ marginTop: '40px' }}>
                                    <Spinner animation="border" style={{ color: '#24A1DE' }} />
                                    <p className="mt-2 text-muted">Загрузка списка...</p>
                                </div>
                            ) : displayedList.length > 0 ? (
                                /* ИСПРАВЛЕНИЕ: Одинаковая сетка для всех */
                                <Row xs={1} md={2} lg={3} className="g-4">
                                    {displayedList.map((order: DsMsghistoryDTO) => {
                                        const created = formatDateTime(order.creation_date);
                                        const formed = formatDateTime(order.forming_date);
                                        const dateEnd = formatDateTime(order.complition_date);
                                        
                                        const displayDate = order.status === 4 || order.status === 5 ? dateEnd : formed;
                                        const dateLabel = order.status === 4 || order.status === 5 ? "Завершена:" : "Сформирована:";

                                        const isActionRequired = isModerator && order.status === STATUS_FORMED;
                                        const cardStyle = isActionRequired 
                                            ? { border: '2px solid #ffc107', backgroundColor: '#fffbe6' } 
                                            : { border: '1px solid #E1E5EA', backgroundColor: '#fff' };

                                        return (
                                            <Col key={order.id}>
                                                <Card 
                                                    className="h-100 shadow-sm card-hover-effect"
                                                    style={{ 
                                                        cursor: "pointer", 
                                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                                        ...cardStyle
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

                                                        {isModerator && (
                                                            <div className="small text-muted mb-2">
                                                                Пользователь ID: <b>{order.creator_login}</b>
                                                            </div>
                                                        )}

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

                                                        <div className="mt-3">
                                                            {isActionRequired ? (
                                                                <div className="small text-center" style={{ padding: '5px 0' }}>
                                                                    <b className="text-warning">Требует проверки</b>
                                                                </div>
                                                            ) : (
                                                                <>
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
                                                                </>
                                                            )}
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            ) : (
                                <div className="text-center py-5 text-muted bg-light rounded-3 w-100">
                                    Заявок не найдено за выбранный период
                                </div>
                            )}
                        </Col>
                    </Row>
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