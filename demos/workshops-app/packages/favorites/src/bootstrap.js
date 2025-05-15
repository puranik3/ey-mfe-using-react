import { createApp } from 'vue';
import Favorites from './components/Favorites.vue';

// Mount function to start up the app
const mount = (el, { mode = 'hosted' } = {}) => {
    const app = createApp(Favorites);
    app.mount(el);

    return {
        unmount() {
            app.unmount();
        }
    };
};

if (process.env.NODE_ENV === 'development') {
    const rootElement = document.getElementById('root-favorites');

    if (rootElement) {
        mount(rootElement, { mode: 'standalone' });
    }
}

export { mount };