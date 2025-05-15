import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

// import { useDispatch, useSelector } from 'react-redux';

// import { selectTheme, toggleTheme } from 'shared/features/themeSlice';

import { publishThemeChanged, subscribeThemeChanged, getContrastTheme } from 'shared/events'

// import './Menu.scss';

const Menu = () => {
    // const { value, contrastValue } = useSelector(selectTheme);
    // const dispatch = useDispatch();

    const [theme, setTheme] = useState('light');
    const contrastTheme = getContrastTheme(theme);

    const toggleTheme = () => {
        const newTheme = getContrastTheme(theme);
        console.log('Theme about to be changed to', newTheme);
        // setTheme(newTheme);
        publishThemeChanged(newTheme);
    };

    useEffect(
        () => {
            const unsubscribe = subscribeThemeChanged(setTheme);

            return unsubscribe;
        },
        []
    );

    return (
        // <Navbar collapseOnSelect expand="lg" variant={value} className={`bg-${value} text-${contrastValue}`}>
        <Navbar collapseOnSelect expand="lg" variant={theme} className={`bg-${theme} text-${contrastTheme}`}>
            <Container>
                <Navbar.Brand as={NavLink} to="/">Workshops App</Navbar.Brand>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
                        <Nav.Link as={NavLink} to="/workshops" end>List of workshops</Nav.Link>
                        <Nav.Link as={NavLink} to="/workshops/add" end>Add a workshop</Nav.Link>
                    </Nav>
                    <NavDropdown title="Personalize" id="basic-nav-dropdown">
                        <NavDropdown.Item as={NavLink} to="/favorites">
                            Favorites
                        </NavDropdown.Item>
                        {/* <NavDropdown.Item href="#" onClick={() => dispatch(toggleTheme())}> */}
                        <NavDropdown.Item href="#" onClick={toggleTheme}>
                            Change Theme
                        </NavDropdown.Item>
                    </NavDropdown>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Menu;