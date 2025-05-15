import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Provider } from 'react-redux';

import store from 'shared/store';

import Layout from './Layout';
import HomeAppComponent from 'home/HomeAppComponent';
import WorkshopsApp from './components/WorkshopsApp';
import FavoritesApp from './components/FavoritesApp';

const routes = [
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                // element: <HomeApp /> // this is the framework-agnostic way of mounting the home MFE
                element: <HomeAppComponent /> // this is the react way of mounting the home MFE
            },
            {
                path: 'workshops/*',
                element: <WorkshopsApp />
            },
            {
                path: 'favorites',
                element: <FavoritesApp />
            }
        ]
    }
];

const router = createBrowserRouter(
    routes
);

const App = () => {
    return (
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    );
};

export default App;