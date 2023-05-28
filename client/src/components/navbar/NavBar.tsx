import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import LogoutButton from '../buttons/LogoutButton';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';

function NavBar() {
    const { user } = useContext(UserContext)
    return (
        <>
            <Navbar bg="primary" expand="lg" variant="dark">
                <Container>
                    <Navbar.Brand href="/">
                        <img
                            alt=""
                            src="https://fplogoimages.withfloats.com/tile/605af6c3f7fc820001c55b20.jpg"
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                        Agarson Shoes Scheduler
                    </Navbar.Brand>
                </Container>
                {user ? <LogoutButton /> : null}
            </Navbar>
        </>
    );
}

export default NavBar;