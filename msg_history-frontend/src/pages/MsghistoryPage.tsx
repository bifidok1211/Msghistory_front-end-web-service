import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchMsghistoryById, 
    updateMsghistoryFields, 
    updateChannelInMsghistory, 
    removeChannelFromMsghistory,
    submitMsghistory,
    deleteMsghistory,
    resetOperationSuccess,
    clearCurrentMsghistory
} from '../store/slices/msghistorySlice';
import type { AppDispatch, RootState } from '../store';
import { AppNavbar } from '../components/Navbar';
import { CustomBreadcrumbs } from '../components/Breadcrumbs';
import './styles/MsghistoryPage.css';

const DefaultImage = '/mock_images/default.png';

const STATUS_DRAFT = 1;

export const MsghistoryPage = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    
    const { currentMsghistory, loading, operationSuccess } = useSelector((state: RootState) => state.msghistory);
    
    // Локальный стейт для описания поста
    const [description, setDescription] = useState('');
    
    // Локальный стейт для полей каналов (views, repost_level)
    // Ключ - channel_id, Значение - объект с данными
    const [channelsData, setChannelsData] = useState<{[key: number]: { views: number, repost_level: number }}>({});

    // 1. Загрузка данных
    useEffect(() => {
        if (id) {
            dispatch(fetchMsghistoryById(id));
        }
        return () => { 
            dispatch(clearCurrentMsghistory()); 
            dispatch(resetOperationSuccess()); 
        }
    }, [id, dispatch]);

    // 2. Синхронизация Redux -> Local State
    useEffect(() => {
        if (currentMsghistory) {
            setDescription(currentMsghistory.description || '');
            
            const chData: {[key: number]: { views: number, repost_level: number }} = {};
            currentMsghistory.channels?.forEach(c => {
                if (c.channel_id) {
                    chData[c.channel_id] = {
                        views: c.views || 0,
                        repost_level: c.repost_level || 0
                    };
                }
            });
            setChannelsData(chData);
        }
    }, [currentMsghistory]);

    // Экран успеха (если удалили или сформировали)
    if (operationSuccess) {
        return (
            <>
                <AppNavbar />
                <div className="container" style={{ marginTop: '100px', textAlign: 'center' }}>
                    <div className="panel" style={{ display: 'inline-block', padding: '40px' }}>
                        <h2 style={{ marginBottom: '20px' }}>Действие выполнено успешно!</h2>
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                            <Link to="/channels" className="card-button tg-btn">К списку каналов</Link>
                            <Link to="/msghistory" className="card-button tg-btn" style={{ background: '#fff', color: '#24A1DE', border: '2px solid #24A1DE' }}>Мои заявки</Link>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (loading || !currentMsghistory) {
        return (
            <>
                <AppNavbar />
                <div className="loading-spinner"><p>Загрузка...</p></div>
            </>
        );
    }

    const isDraft = currentMsghistory.status === STATUS_DRAFT;
    
    // Хлебные крошки
    const breadcrumbs = [
        { label: 'Мои заявки', path: '/msghistory' },
        { label: `Заявка №${currentMsghistory.id}`, active: true },
    ];

    // --- Обработчики ---

    // Сохранение описания поста
    const handleSaveDescription = () => {
        if (currentMsghistory.id) {
            dispatch(updateMsghistoryFields({
                id: currentMsghistory.id,
                data: { description }
            }))
            .unwrap()
            .then(() => alert("Описание сохранено!"))
            .catch(() => alert("Ошибка сохранения"));
        }
    };

    // Изменение инпутов канала локально
    const handleChannelChange = (cId: number, field: 'views' | 'repost_level', value: string) => {
        const numVal = parseFloat(value) || 0;
        setChannelsData(prev => ({
            ...prev,
            [cId]: {
                ...prev[cId],
                [field]: numVal
            }
        }));
    };

    // Сохранение данных конкретного канала
    const handleSaveChannel = (cId: number) => {
        if (currentMsghistory.id && channelsData[cId]) {
            dispatch(updateChannelInMsghistory({
                msghistoryId: currentMsghistory.id,
                channelId: cId,
                data: {
                    views: channelsData[cId].views,
                    repost_level: channelsData[cId].repost_level
                }
            }))
            .unwrap()
            .then(() => alert("Данные канала сохранены"))
            .catch(() => alert("Ошибка сохранения"));
        }
    };

    // Удаление канала
    const handleRemoveChannel = (cId: number) => {
        if (window.confirm("Убрать канал из списка?")) {
            dispatch(removeChannelFromMsghistory({
                msghistoryId: currentMsghistory.id!,
                channelId: cId
            }));
        }
    };

    // Сформировать
    const handleSubmitOrder = () => {
        if (currentMsghistory.id) {
            dispatch(submitMsghistory(currentMsghistory.id));
        }
    };

    // Удалить пост целиком
    const handleDeleteOrder = () => {
        if (currentMsghistory.id && window.confirm('Вы точно хотите удалить этот пост?')) {
            dispatch(deleteMsghistory(currentMsghistory.id));
        }
    };

    return (
        <>
            <AppNavbar />

            <div style={{ marginTop: '90px'}}>
                <CustomBreadcrumbs crumbs={breadcrumbs} />
            </div>

            <div className="page-title">Анализ поста</div>

            {/* ВЕРХНЯЯ ЗОНА: Описание + Результат */}
            <div className="order-top">
                {/* 3/4: Введите описание поста */}
                <div className="post-desc panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <p className="post-desc__title">Описание поста:</p>
                        {isDraft && (
                            <button className="save-mini-btn" onClick={handleSaveDescription}>
                                Сохранить текст
                            </button>
                        )}
                    </div>
                    <textarea 
                        className="post-desc__area" 
                        name="post_description" 
                        placeholder="Введите текст поста..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={!isDraft}
                    />
                </div>
            
                {/* 1/4: Результат */}
                <div className="order-summary panel">
                    <p className="order-summary__title">Результат</p>
                    
                    {!isDraft ? (
                        <>
                            <div className="order-summary__row">
                                <span>Охват:</span>
                                <span className="order-summary__value" style={{ color: '#24A1DE', fontWeight: 'bold' }}>
                                    {currentMsghistory.coverage ? currentMsghistory.coverage.toFixed(1) + '%' : '0%'}
                                </span>
                            </div>
                            <div className="order-summary__row">
                                <span>Коэффициент:</span>
                                <span className="order-summary__value" style={{ color: '#24A1DE', fontWeight: 'bold' }}>
                                    {currentMsghistory.coefficient ? currentMsghistory.coefficient.toFixed(2) : '0.00'}
                                </span>
                            </div>
                            <div style={{ marginTop: 'auto', fontSize: '14px', color: '#28a745', textAlign: 'center' }}>
                                Заявка сформирована
                            </div>
                        </>
                    ) : (
                        <div style={{ marginTop: '10px', color: '#999', fontSize: '14px', lineHeight: '1.4' }}>
                            Результаты расчета будут доступны после формирования заявки.
                        </div>
                    )}
                </div>
            </div>

            {/* СПИСОК «строк-панелей» анализа */}
            <div className="analysis-list">
                {currentMsghistory.channels?.map(item => {
                    const cId = item.channel_id!;
                    const localData = channelsData[cId] || { views: 0, repost_level: 0 };
                    
                    return (
                        <div className="analysis-row" key={cId}>
                            {/* Колонка 1 — канал */}
                            <div className="analysis-col analysis-col--channel">
                                <img className="channel-img" src={item.image || DefaultImage} alt={item.title} />
                                <p className="channel-title">{item.title}</p>
                                <Link className="tg-btn" to={`/channel/${cId}`} style={{ width: '140px', fontSize: '14px', height: '36px', lineHeight: '36px' }}>Перейти</Link>
                                
                                {isDraft && (
                                    <button 
                                        className="text-danger-link" 
                                        onClick={() => handleRemoveChannel(cId)}
                                        style={{ marginTop: '10px', background: 'none', border: 'none', color: '#d9534f', fontSize: '13px', cursor: 'pointer' }}
                                    >
                                        Убрать из списка
                                    </button>
                                )}
                            </div>

                            {/* Колонка 2 — подписчики (число) */}
                            <div className="analysis-col">
                                <div className="metrics-label">Количество подписчиков:</div>
                                <div className="metrics-value">
                                    {item.subscribers || '-'}
                                </div>
                            </div>

                            {/* Колонка 3 — просмотры (инпут) */}
                            <div className="analysis-col">
                                <div className="metrics-label">Количество просмотров:</div>
                                <input 
                                    className="metrics-input" 
                                    type="number" 
                                    value={localData.views}
                                    onChange={(e) => handleChannelChange(cId, 'views', e.target.value)}
                                    placeholder="0"
                                    disabled={!isDraft}
                                />
                            </div>

                            {/* Колонка 4 — второй параметр (инпут) + Кнопка сохранения строки */}
                            <div className="analysis-col">
                                <div className="metrics-label">Уровень репоста:</div>
                                <input 
                                    className="metrics-input" 
                                    type="number" 
                                    value={localData.repost_level}
                                    onChange={(e) => handleChannelChange(cId, 'repost_level', e.target.value)}
                                    placeholder="0"
                                    disabled={!isDraft}
                                />
                                
                                {isDraft && (
                                    <button 
                                        className="save-mini-btn" 
                                        onClick={() => handleSaveChannel(cId)}
                                        style={{ marginTop: '15px', width: '100%' }}
                                    >
                                        Сохранить данные
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}

                {(!currentMsghistory.channels || currentMsghistory.channels.length === 0) && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                        В этой заявке пока нет каналов. Добавьте их через список каналов.
                    </div>
                )}
            </div>

            {/* Кнопки управления заявкой */}
            {isDraft && (
                <div className="tg-actions-row">
                    <button className="card-button" style={{ background: '#d9534f' }} onClick={handleDeleteOrder}>
                        Удалить пост
                    </button>
                    
                    <button className="card-button" style={{ background: '#28a745' }} onClick={handleSubmitOrder}>
                        Сформировать отчет
                    </button>
                </div>
            )}
        </>
    );
};