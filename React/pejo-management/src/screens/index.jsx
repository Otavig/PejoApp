import './style.css';
import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Listar from './sing-up/listar';
import Cadastrar from './list/cadastrar';

function Home() {
    const [activeScreen, setActiveScreen] = useState('home');
    const [theme, setTheme] = useState('dark');

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    const closeCadastrar = () => {
        setActiveScreen('home');
    };

    const renderScreen = () => {
        switch (activeScreen) {
            case 'cadastrar':
                return <Cadastrar theme={theme} closeCadastrar={closeCadastrar} />;
            case 'listar':
                return <Listar theme={theme} />;
            default:
                return null;
        }
    };

    return (
        <>
            <Navbar data-bs-theme={`${theme === 'dark' ? 'dark' : 'light'}`} expand="lg" className={`nav_ ${theme}`}>
                <Container>
                    <Navbar.Brand>PejoAPP manager</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link onClick={() => setActiveScreen('cadastrar')}>Cadastrar</Nav.Link>
                            <Nav.Link onClick={() => setActiveScreen('listar')}>Listar</Nav.Link>
                        </Nav>
                        <Button variant={theme === 'dark' ? 'outline-light' : 'outline-dark'} onClick={toggleTheme}>
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container>
                {renderScreen()}
            </Container>
        </>
    );
}

export default Home;
