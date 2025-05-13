// import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Menu from './components/Menu/Menu';
import HomeApp from './components/HomeApp';
import WorkshopsApp from './components/WorkshopsApp';

import styles from './App.module.scss';

const App = () => {
    return (
        <BrowserRouter>
            <Menu />
            <Container className="my-4">
                {/* <h1 className={styles.heading}>A heading in container app</h1> */}
                <Routes>
                    <Route path="/" element={<HomeApp />} />
                    <Route path="/workshops/*" element={<WorkshopsApp />} />
                </Routes>
            </Container>
        </BrowserRouter>
    );
};

export default App;