import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Layout from './Layout';
import HomeApp from './components/HomeApp';
import WorkshopsApp from './components/WorkshopsApp';

const routes = [
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <HomeApp />
            },
            {
                path: 'workshops/*',
                element: <WorkshopsApp />
            }
        ]
    }
];

const router = createBrowserRouter(
    routes
);

const App = () => {
    return (
        <RouterProvider router={router} />
    );
};

export default App;