import { createRoot } from 'react-dom/client';

import { createBrowserRouter, createMemoryRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';

import Layout from './Layout';
import WorkshopsList from './components/workshops/WorkshopsList/WorkshopsList';
import WorkshopDetails from './components/workshops/WorkshopDetails/WorkshopDetails';

import App from './App';

const routes = [
    {
        path: '/workshops',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <WorkshopsList />
            },
            {
                path: ':id',
                element: <WorkshopDetails />,
            }
        ]
    }
];

const mount = (rootElement, { defaultRouter, initialPath, onNavigate }) => {
    console.log('workshops::bootstrap::mount initialPath:', initialPath);

    // We use browser history when the MFE is rendered in standalone mode, and memory router when rendered through the host container app
    const router = defaultRouter || createMemoryRouter(
        routes,
        {
            initialEntries: [initialPath],
        }
    );

    console.log('workshops::bootstrap::router:', router);

    router.subscribe(() => {
        const location = router.state.location;

        const search = location.search; // ?page=1 -> ?page=2
        const pathname = location.pathname; // /workshops -> /workshops/2

        console.log('workshops::bootstrap::router.subscribe::search:', search);
        console.log('workshops::bootstrap::router.subscribe::pathname:', pathname);

        if (onNavigate && typeof onNavigate === 'function') {
            console.log('workshops::bootstrap::router.subscribe::calling onNavigate');

            onNavigate({
                pathname: window.location.pathname, // current browser url
                nextPathname: pathname, // what is the new path in the memory router
                search
            });
        }
    });

    const root = createRoot(rootElement);

    root.render(
        <div className="workshops">
            <App router={router} />
        </div>
    );

    return {
        // the container app is expected to call this on link clicks in its UI (eg. Menu link click)
        onParentNavigate({ nextPathname }) {
            console.log('workshops::bootstrap::onParentNavigate', nextPathname); // the container browser router's new URL (browser will show this)

            // const { pathname } = history.location;
            const { pathname } = router.state.location; // workshops/2 (Details page currently shown)

            if (pathname !== nextPathname) {
                // history.push(nextPathname);
                console.log('workshops::bootstrap::onParentNavigate Navigating to nextPathname:', nextPathname);

                // change the memory router location state
                router.navigate(nextPathname/*, { replace: true }*/);
            }
        },
        unmount() {
            console.log('workshops::bootstrap::unmount');
            root.unmount();
        }
    };
};

// standalone mode
if (process.env.NODE_ENV === 'development') {
    const rootElement = document.getElementById('root-workshops');

    if (rootElement) {
        console.log('workshops::bootstrap::Mounting Workshops App in isolation');

        mount(rootElement, createBrowserRouter(routes));
    }
}

export { mount };