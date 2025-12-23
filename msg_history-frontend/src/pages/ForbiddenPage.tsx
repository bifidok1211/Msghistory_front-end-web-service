import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldLockFill, ArrowLeft } from 'react-bootstrap-icons';
import './styles/ErrorPages.css';

export const ForbiddenPage = () => {
    const navigate = useNavigate();

    return (
        <div className="error-page-container">
            <div className="error-card">
                <div className="error-code">403</div>
                <div className="error-content">
                    <div className="error-icon-wrapper">
                        <ShieldLockFill size={50} />
                    </div>
                    <h1 className="error-title">Доступ запрещен</h1>
                    <p className="error-desc">
                        У вас недостаточно прав для просмотра этой страницы.
                        Этот раздел доступен только модераторам системы <b>Msghistory</b>.
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                        <Button 
                            variant="light" 
                            onClick={() => navigate(-1)} 
                            className="error-btn-outline"
                        >
                            <ArrowLeft className="me-2" /> Назад
                        </Button>
                        <Link to="/">
                            <Button className="error-btn shadow-sm">
                                На главную
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};