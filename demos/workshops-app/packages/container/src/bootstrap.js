import { createRoot } from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.css';

import App from './App';

const rootElement = document.getElementById('root-container');
if (!rootElement) {
    throw new Error('Failed to find the root element');
}

const root = createRoot(rootElement);
root.render(<App />);
