import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <>
            <div>
                <Link to="/workshops">List of workshops</Link>
            </div>
            <Outlet />
        </>
    );
};

export default Layout;