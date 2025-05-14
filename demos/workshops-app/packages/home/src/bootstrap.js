import { createRoot } from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.css';

import App from './App';

// We shall call this from here, as well as host MFE (say, container) - rootElement can be different from what's here in the host MFE (say, container)
const mount = (el) => {
    const root = createRoot(el);
    root.render(<App />);

    return {
        unmount() {
            root.unmount();
        }
    };
}

if (process.env.NODE_ENV === 'development') {
    const rootElement = document.getElementById('root-home');

    // if mount() is called by host MFE (say, container), rootElement will be null
    // when home is run standalone, rootElement is NOT null and it mounts fine still
    if (rootElement) {
        mount(rootElement);
    }
}

// export it, so that we can call mount() in host MFEs (say, container)
export { mount }