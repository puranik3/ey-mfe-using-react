import { createRoot } from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.css';

import App from './App';

const mount = (el) => {
    const root = createRoot(el);
    root.render(<App />);
}

if (process.env.NODE_ENV === 'development') {
    const rootElement = document.getElementById('root-workshops');

    if (rootElement) {
        mount(rootElement);
    }
}

export { mount }