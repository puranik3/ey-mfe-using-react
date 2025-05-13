import { ErrorAlert, FormattedDate, LoadingSpinner } from './components';

const App = () => {
    return (
        <div className="app-shared">
            <div>
                <h1>Shared App</h1>
                <hr />

                <p>This is a shared app that contains common components. It is used by other microfrontends. Here are some example usages.</p>

                <ErrorAlert error={new Error("Some error occured")} />
                <FormattedDate date={new Date()} />
                <LoadingSpinner />
            </div>
        </div>
    );
};

export default App;