import LogoutButton from '../buttons/LogoutButton';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Link } from 'react-router-dom';
import { paths } from '../../Routes';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { AppChoiceActions, ChoiceContext } from '../../contexts/DialogContext';
import UpdatePasswordModal from '../modals/users/UpdatePasswordModal';

function NavBar() {
    const { user } = useContext(UserContext)
    const { setChoice } = useContext(ChoiceContext)
    return (
        <>
            <UpdatePasswordModal />
            <div className="bg-dark justify-content-between align-items-between d-flex gap-1">
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
                    {user ? <>
                        <Dropdown>
                            <Dropdown.Toggle variant="dark" id="dropdown-basic">
                                {user.username.toUpperCase()}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setChoice({ type: AppChoiceActions.update_password })}><img height="30" width="30" src="https://img.icons8.com/color/48/keys-holder.png" alt="icons" />Update Password</Dropdown.Item>
                                <Dropdown.Item className="border border-bottom-1"><LogoutButton /></Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </> : null}
                </div>
                {
                    user ?
                        <>
                            <div className="d-none d-md-flex  gap-1 justify-content-center align-items-center ">
                                <Link className="text-white text-decoration-none rounded shadow p-2 text-uppercase fw-bold fs-6" to={paths.users}>Users</Link>
                                <Link className="text-white text-decoration-none rounded shadow p-2 text-uppercase fw-bold fs-6" to={paths.tasks}>Tasks</Link>
                                <Link className="text-white text-decoration-none rounded shadow p-2 text-uppercase fw-bold fs-6" to={paths.messages}>Messages</Link>
                                <Link className="text-white text-decoration-none rounded shadow p-2 text-uppercase fw-bold fs-6" to={paths.records}>Records</Link>

                            </div>
                            <Dropdown className="d-sm-block d-md-none">
                                <Dropdown.Toggle variant="dark" id="dropdown-basic">
                                    {":: "}  
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="bg-dark">
                                    <Dropdown.Item className="border border-bottom-1">
                                        <Link className="text-white w-100 text-decoration-none rounded shadow  text-uppercase fw-bold fs-6" to={paths.users}>Users</Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item className="bg-dark">
                                        <Link className="text-white w-100 text-decoration-none rounded shadow  text-uppercase fw-bold fs-6" to={paths.tasks}>Tasks</Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item className="border border-bottom-1">
                                        <Link className="text-white w-100 text-decoration-none rounded shadow  text-uppercase fw-bold fs-6" to={paths.messages}>Messages</Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item className="border border-bottom-1">
                                        <Link className="text-white w-100 text-decoration-none rounded shadow  text-uppercase fw-bold fs-6" to={paths.records}>Records</Link>
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>


                        </>
                        : null
                }
            </div >
        </>
    );
}

export default NavBar;
