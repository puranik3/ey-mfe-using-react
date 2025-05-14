import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { ThemeProvider } from 'shared/contexts';

import Layout from './Layout';
import HomeAppComponent from 'home/HomeAppComponent';
import WorkshopsApp from './components/WorkshopsApp';

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
            }
        ]
    }
];

const router = createBrowserRouter(
    routes
);

const App = () => {
    return (
        <ThemeProvider>
            <RouterProvider router={router} />
        </ThemeProvider>
    );
};

export default App;