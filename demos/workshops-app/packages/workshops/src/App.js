import { RouterProvider } from 'react-router-dom';

const App = ({ router }) => {
    return (
        <div className="app-workshops">
            <RouterProvider router={router} />
        </div>
    );
};

export default App;