// import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Menu from './components/Menu/Menu';
import HomeApp from './components/HomeApp';

const App = () => {
    return (
        <BrowserRouter>
            <Menu />
            <Container className="my-4">
                <Routes>
                    <Route path="/" element={<HomeApp />} />
                </Routes>
            </Container>
        </BrowserRouter>
    );
};

export default App;