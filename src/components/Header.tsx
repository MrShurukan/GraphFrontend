import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext.tsx';

const Header = () => {
    const { isAuthenticated, logout, role } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
            <span className="navbar-brand">GraphFrontend</span>
            {isAuthenticated && (
                <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Домашняя</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/charts">Графики</Link>
                    </li>
                    {role === 'Admin' && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/create-user">Создать пользователя</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/users">Список пользователей</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/upload">Выгрузить CSV</Link>
                            </li>
                        </>
                    )}
                </ul>
            )}
            {isAuthenticated && (
                <button className="btn btn-outline-danger" onClick={logout}>Выйти</button>
            )}
        </nav>
    );
};

export default Header;