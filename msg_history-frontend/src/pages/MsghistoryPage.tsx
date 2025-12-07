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
    
    const [description, setDescription] = useState('');
    const [channelsData, setChannelsData] = useState<{[key: number]: { views: number, repost_level: number }}>({});

    useEffect(() => {
        if (id) {
            dispatch(fetchMsghistoryById(id));
        }
        return () => { 
            dispatch(clearCurrentMsghistory()); 
            dispatch(resetOperationSuccess()); 
        }
    }, [id, dispatch]);

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
    
    const breadcrumbs = [
        { label: 'Мои заявки', path: '/msghistory' },
        { label: `Заявка №${currentMsghistory.id}`, active: true },
    ];

    const handleSaveDescription = () => {
        if (currentMsghistory.id) {
            dispatch(updateMsghistoryFields({
                id: currentMsghistory.id,
                data: { description }
            }))
            .unwrap()
        }
    };

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
        }
    };

    const handleRemoveChannel = (cId: number) => {
        if (window.confirm("Убрать канал из списка?")) {
            dispatch(removeChannelFromMsghistory({
                msghistoryId: currentMsghistory.id!,
                channelId: cId
            }))
            .unwrap()
            .then(() => console.log("Канал удален из заявки"));
        }
    };

    const handleSubmitOrder = () => {
        if (currentMsghistory.id) {
            dispatch(submitMsghistory(currentMsghistory.id))
                .unwrap()
        }
    };

    const handleDeleteOrder = () => {
        if (currentMsghistory.id && window.confirm('Вы точно хотите удалить этот пост?')) {
            dispatch(deleteMsghistory(currentMsghistory.id))
                .unwrap()
        }
    };

    return (
        <>
            <AppNavbar />

            <div style={{ marginTop: '90px'}}>
                <CustomBreadcrumbs crumbs={breadcrumbs} />
            </div>

            <div className="page-title">Анализ поста</div>

            {/* ВЕРХНЯЯ ЗОНА */}
            <div className="order-top">
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

            {/* НОВАЯ ТАБЛИЦА С КАРТОЧКАМИ */}
            <div className="analysis-container">
                
                {/* ШАПКА ТАБЛИЦЫ */}
                <div className="list-header">
                    <div className="header-col">Канал</div>
                    <div className="header-col text-center">Подписчики</div>
                    <div className="header-col text-center">Просмотры</div>
                    <div className="header-col text-center">Уровень репоста</div>
                    <div className="header-col text-center" style={{width: '160px'}}>Действия</div>
                </div>

                <div className="analysis-list">
                    {currentMsghistory.channels?.map(item => {
                        const cId = item.channel_id!;
                        const localData = channelsData[cId] || { views: 0, repost_level: 0 };
                        
                        return (
                            <div className="analysis-row" key={cId}>
                                {/* Колонка 1: Канал */}
                                <div className="analysis-col analysis-col--info">
                                    <img className="channel-img-small" src={item.image || DefaultImage} alt={item.title} />
                                    <span className="channel-title-row">{item.title}</span>
                                </div>

                                {/* Колонка 2: Подписчики */}
                                <div className="analysis-col text-center">
                                    <div className="metrics-value-row">
                                        {item.subscribers || '-'}
                                    </div>
                                </div>

                                {/* Колонка 3: Просмотры */}
                                <div className="analysis-col text-center">
                                    <input 
                                        className="metrics-input-row" 
                                        type="number" 
                                        value={localData.views}
                                        onChange={(e) => handleChannelChange(cId, 'views', e.target.value)}
                                        placeholder="0"
                                        disabled={!isDraft}
                                    />
                                </div>

                                {/* Колонка 4: Репосты */}
                                <div className="analysis-col text-center">
                                    <input 
                                        className="metrics-input-row" 
                                        type="number" 
                                        value={localData.repost_level}
                                        onChange={(e) => handleChannelChange(cId, 'repost_level', e.target.value)}
                                        placeholder="0"
                                        disabled={!isDraft}
                                    />
                                </div>

                                {/* Колонка 5: Кнопки действий (Стек) */}
                                <div className="analysis-col analysis-col--actions">
                                    <Link to={`/channel/${cId}`} className="action-btn btn-details">
                                        Подробнее
                                    </Link>
                                    
                                    {isDraft && (
                                        <>
                                            <button className="action-btn btn-save" onClick={() => handleSaveChannel(cId)}>
                                                Сохранить
                                            </button>
                                            <button className="action-btn btn-delete" onClick={() => handleRemoveChannel(cId)}>
                                                Удалить
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {(!currentMsghistory.channels || currentMsghistory.channels.length === 0) && (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#999', background: '#F5F5F5', borderRadius: '12px', border: '1px solid #E1E5EA', boxShadow: '10px 10px 0 #D9D9D9' }}>
                            В этой заявке пока нет каналов. Добавьте их через список каналов.
                        </div>
                    )}
                </div>
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