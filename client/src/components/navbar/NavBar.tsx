import LogoutButton from '../buttons/LogoutButton';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Link } from 'react-router-dom';
import { paths } from '../../Routes';

function NavBar() {
    const { user } = useContext(UserContext)
    return (
        <div className="bg-primary justify-content-between align-items-between d-flex gap-1 w-100">
            <div className="d-flex align-items-center">
                <Link to={paths.users}>
                    <img
                        className="m-2 d-inline-block rounded-circle"
                        alt=""
                        src="https://fplogoimages.withfloats.com/tile/605af6c3f7fc820001c55b20.jpg"
                        width="40"
                        height="40"
                    />
                </Link>
                {user ? <LogoutButton /> : null}
            </div>
            {
                user ?
                    <div className="d-flex gap-1 justify-content-center align-items-center ">
                        <Link className="text-white text-decoration-none rounded shadow p-2 text-uppercase fw-bold fs-6" to={paths.users}>Users</Link>
                        <Link className="text-white text-decoration-none rounded shadow p-2 text-uppercase fw-bold fs-6" to={paths.tasks}>Tasks</Link>
                        <Link className="text-white text-decoration-none rounded shadow p-2 text-uppercase fw-bold fs-6" to={paths.messages}>Messages</Link>

                    </div>
                    : null
            }
        </div>
    );
}

export default NavBar;