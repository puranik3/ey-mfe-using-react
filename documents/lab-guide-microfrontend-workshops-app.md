# Building a Microfrontend React app - Workshops App

## Step 0 (Optional step): General setup
- Add .editorconfig in project folders
```
# .editorconfig file
root = true

[*]
indent_style = space
indent_size = 4
```
- Add VSCode settings file in VS Code workspace `.vscode/settings.json`
```json
{
    "editor.tabSize": 4,
    "editor.insertSpaces": true
}
```

## Step 1: Set up the MFE folder structure
- Create folder `workshops-app`
- `mkdir -p packages/container packages/home packages/workshops packages/sessions packages/auth packages/shared`
- Set up folder structure in each folder
    - `mkdir -p config src/components public`
    - `touch config/webpack.common.js config/webpack.dev.js config/webpack.prod.js src/index.js src/bootstrap.js src/App.js public/index.html`

## Step 2: Install dependencies
- Create `package.json` in each folder

```
npm init -y
```

- Install the Webpack (including Webpack Dev Server, required module loaders and plugins), Babel (along with required plugins and presets)

```
npm i -D @babel/cli @babel/core @babel/plugin-transform-runtime @babel/preset-env @babel/preset-typescript @babel/preset-react typescript sass webpack webpack-cli webpack-dev-server babel-loader ts-loader style-loader css-loader sass-loader html-webpack-plugin
```
- Install React, React DOM, React Router DOM, React Bootstrap, Axios
```
npm i react react-dom react-router-dom bootstrap react-bootstrap axios
```

## Step 3: Setup Webpack for the dev build
- Set up `webpack.common.js`, `webpack.dev.js` configuration in each. The port numbers to use are
    - container : 3000
    - home : 3001
    - workshops : 3002
    - sessions : 3003
    - auth : 3004
    - shared : 3005

-   `webpack.common.js`

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            [
                                "@babel/preset-react",
                                { "runtime": "automatic" }
                            ],
                            "@babel/preset-env"
                        ],
                        plugins: ["@babel/plugin-transform-runtime"],
                    },
                },
            },
            {
                test: /\.(css|s[ac]ss)$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
        }),
    ],
};
```
- __Aside__: In order to aoid explicit import when setting up transpilation directly using `typescript` compiler with `tsconfig.json` do so - In `tsconfig.json`. You can ignore it for this setup (we have the same effect here using `{ "runtime": "automatic" }`).
```json
{
  "compilerOptions": {
    "jsx": "react-jsx"  // Use "react-jsx" instead of "react"
  }
}
```
-   `webpack.dev.js` - make changes to the __port__ as mentioned in the list above

```js
const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common");

const devConfig = {
    mode: "development",
    output: {
        publicPath: "http://localhost:3000/",
    },
    devServer: {
        port: 3000,
        historyApiFallback: {
            index: "/index.html",
        },
    },
};

module.exports = merge(commonConfig, devConfig);
```

## Step 4: Set up the single HTML page
- Set up `public/index.html` in each folder

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Workshops app (Container / Shell)</title>
    </head>
    <body>
        <div id="root-container"></div>
    </body>
</html>
```

-   Name the root element with these ids
    -   container : root-container
    -   home : root-home
    -   workshops : root-workshops
    -   sessions : root-sessions
    -   auth : root-auth
    -   shared : root-shared

## Step 5: Set up the container app's other basic files
- Add `index.js`, `bootstrap.js` and `App.js` in __container__ app
- In `index.js`
```
import('./bootstrap');
```
- In `bootstrap.js`
```jsx
import { createRoot } from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.css';

import App from './App';

const rootElement = document.getElementById('root-container');
if (!rootElement) {
    throw new Error('Failed to find the root element');
}

const root = createRoot(rootElement);
root.render(<App />);
```
- In `App.js`
```jsx
const App = () => {
  return (
    <div>Container App component</div>
  );
};

export default App;
```

## Step 6: Launch the container app
- Add `start` script in `package.json` in each folder
```json
"scripts": {
    "start": "webpack serve --config config/webpack.dev.js"
},
```
- We are ready to start the container app. From the container folder,
```
npm start
```
- Open container app in the browser - `http://localhost:3000`

## Step 7: Set up Home component
- In the home app, set up `components/Home/Home.js` and a `mount()` function that takes care of rendering and is called immediately in standalone mode, and is exported for use in the container.
- In home app `components/Home/Home.js`
```jsx
const Home = () => {
    return (
        <>
            <h1>Workshops App</h1>

            <hr />

            <section>
                <p>Welcome to Workshops App</p>
                <p>
                    The app serves details of (fictitious) technical workshops happening in
                    various cities. Every workshop has a broad topic (eg. JavaScript), and a
                    workshop has many sessions (each session covers a sub-topic, eg. Closures in
                    JavaScript).
                </p>
                <p>
                    You can view a list of workshops, details of every workshop, add a workshop,
                    view the list of sessions in a workshop, and also add a new session for a
                    workshop.
                </p>
            </section>
        </>
    );
}

export default Home;
```
- In home app `App.js`
```jsx
import Home from './components/Home/Home';

const App = () => {
  return (
    <Home />
  );
};

export default App;
```
- In home app `bootstrap.js`
```jsx
import { createRoot } from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.css';

import App from './App';

// Mount function to start up the app
const mount = (rootElement) => {
    const root = createRoot(rootElement);
    root.render(<App />);
};

// If we are in development and in isolation, call mount immediately
if (process.env.NODE_ENV === 'development') {
    const rootElement = document.getElementById('root-home');
    
    if (rootElement) {
        mount(rootElement);
    }
}

// We are running through container and we should export the mount function
export { mount };
```
- Start the home app
```
npm start
```
- Open home app in the browser - `http://localhost:3001`

## Step 8: Expose the home app and render it in the container
This is the most important step that enables microfrontend apps to work with each other! Make sure you understand these steps and the choices we make to mount the remote app 100%.
- In home app's `webpack.dev.js`
```js
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const packageJson = require('../package.json');
```
```js
plugins: [
    // Add this
    new ModuleFederationPlugin({
      name: 'home',
      filename: 'remoteEntry.js',
      exposes: {
        './HomeApp': './src/bootstrap',
      },
      shared: packageJson.dependencies,
    }),

    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
],
```
- In container's `webpack.config.js`
```js
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const packageJson = require('../package.json');
```
```js
plugins: [
    new ModuleFederationPlugin({
      name: 'container',
      remotes: {
        home: 'home@http://localhost:3001/remoteEntry.js',
      },
      shared: packageJson.dependencies,
    }),
],
```
- In the container app, create `components/HomeApp.js`. Render a container element to show the home app, call `mount()` and pass this element as the mount point.
```jsx
import { mount } from 'home/HomeApp';
import { useRef, useEffect } from 'react';

export default () => {
  const ref = useRef(null);

  useEffect(() => {
    mount(ref.current);
  }, []);

  return <div ref={ref} />;
};
```
- In container app's `App.js`
```jsx
import { Container } from 'react-bootstrap';
import HomeApp from './components/HomeApp';

const App = () => {
    return (
        <Container className="my-4">
            <HomeApp />
        </Container>
    );
};

export default App;
```
- Restart the container app and home app (__do so whenever any configuration file like webpack config file changes are made__). Make sure the home app is also running. You should be able to see the Home app on `http://localhost:3000`

## Step 9: Add an app-wide menu
- In container app add `components/Menu/Menu.js`
```jsx
import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import './Menu.scss';

const Menu = () => {
    return (
        <Navbar collapseOnSelect expand="lg" className="bg-light text-dark">
            <Container>
                <Navbar.Brand as={NavLink} to="/">Workshops App</Navbar.Brand>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
                        <Nav.Link as={NavLink} to="/workshops" end>List of workshops</Nav.Link>
                        <Nav.Link as={NavLink} to="/workshops/add" end>Add a workshop</Nav.Link>
                    </Nav>
                    <NavDropdown title="Personalize" id="basic-nav-dropdown">
                        <NavDropdown.Item as={NavLink} to="/workshops/favorites">
                            Favorites
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#">
                            Change Theme
                        </NavDropdown.Item>
                    </NavDropdown>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Menu;
```
- Include it in the container `App.js`. Also set up Routing using browser history.
```jsx
import { Container } from 'react-bootstrap';
// import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
// import { createBrowserHistory } from 'history';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Menu from './components/Menu/Menu';
import HomeApp from './components/HomeApp';

// const history = createBrowserHistory();

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Menu />
                <Container className="my-4">
                    <Routes>
                        <Route path="/" element={<HomeApp />} />
                    </Routes>
                </Container>
            </BrowserRouter>
        </>
    );
};

export default App;
```

## Step 10: Scoping CSS styles to MFEe
- Let us try adding a simple style in home app's `components/Home/Home.scss`
```scss
h1 {
    color: crimson;
}
```
- Include it in home app's `components/Home/Home.js`
```jsx
import './Home.scss';

const Home = () => {
    // code...
}
```
- The styles reflect on the page in both container and home apps. However, the styles from the home app leak on to the container app - to test this add a heading in the container app. In container app's `App.js`
```jsx
<Container className="my-4">
    <h1>A heading in container app</h1>
    <Routes>
        <Route path="/" element={<HomeApp />} />
    </Routes>
</Container>
```
- Notice that the new heading is also in crimson. To avoid this, we can scope styles to the MFE defining it. We will see two approaches here - explicit scoping, and implicit scoping using Module CSS.


### Approach 1 - Explicit scoping: Scope the heading by nesting the styles in `.home` class in home app's `Home.scss`
```scss
.home {
    // same as .home h1
    h1 {
        color: crimson;
    }
}
```
- Scope the home component using the home class in home app's `components/Home/Home.js`
```jsx
const Home = () => {
    return (
        <div className="home">
            {/* UI code... */}
        </div>
    );
}
```
- The problem is solved

### Approach 2 (Ignore) - Module CSS / SCSS (__Not working as of now - ignore__)
- Modify the style-related module loaders configuration (`module.rules`) in `webpack.common.js` to so (in all apps)
```js
{
    test: /\.s?css$/,
    exclude: /\.module\.s?css$/,
    use: ['style-loader', 'css-loader', 'sass-loader']
},
{
    test: /\.module\.s?css$/,
    use: [
        'style-loader',
        {
            loader: 'css-loader',
            options: {
                modules: {
                    localIdentName: '[name]__[local]___[hash:base64:5]',
                },
            },
        },
        'sass-loader',
    ],
},
```
- Define the style instead in home app's `components/Home/Home.module.scss`. When using Module CSS / SCSS, the styles are defined using class selector. The class names are transformed to include random characters during the build (CSS loader processes them), making them unique to the MFE defining them. Thus the a CSS class defined in one app does not affect another that defines a CSS class with the SAME name.
```scss
.heading {
    color: crimson;
}
```
- In home app's `components/Home/Home.js`
```jsx
import classes from './Home.module.scss';

const Home = () => {
    return (
        <div>
            <h1 className={classes.heading}>Workshops App</h1>

            {/* UI code... */}
        </div>
    );
}

export default Home;
```
- Now even if we define a class with the name `heading` in the container app, it won't affect elements with that class in the container (i.e. those components whose UI is defined by the container).
- __NOTE__: This approach is throwing an error at runtime. SCSS Modules not working in a microfrontend setup using Webpack Module Federation is a known, common issue, especially when remote apps don’t have SCSS or CSS Module support fully configured or exposed correctly (__work in progress__)

## Step 11: Add workshops list component
- __EXERCISE__: In workshops app, set up `index.js`, `bootstrap.js`, `App.js`. In App component import and render `WorkshopsList` from `src/components/workshops/WorkshopsList/WorkshopsList` (we create this next). Make sure the webpack config is simlar to home app (includes loaders for processing CSS etc.)
- In workshops app add `src/services/workshops.js`
```js
import axios from 'axios';

const baseUrl = `https://workshops-server.onrender.com`;

const getWorkshops = async () => {
    const response = await axios.get(`${baseUrl}/workshops`);

    return response.data;
}

const getWorkshopById = async (id) => {
    const response = await axios.get(`${baseUrl}/workshops/${id}`);

    return response.data;
};

export {
    getWorkshops,
    getWorkshopById
}
```
- In workshops app, add `components/workshops/WorkshopsList.js`
```jsx
// sfc
import { useEffect, useState } from 'react';
import { Alert, Col, Row, Spinner } from "react-bootstrap";

import Item from './Item/Item';

import { getWorkshops } from '../../../services/workshops';

const WorkshopsList = () => {
    const [loading, setLoading] = useState(true);
    const [workshops, setWorkshops] = useState([]);
    const [error, setError] = useState(null);

    useEffect(
        () => {
            setLoading(true);

            const helper = async () => {
                try {
                    const workshops = await getWorkshops();
                    setWorkshops(workshops);
                } catch (error) {
                    setError(error);
                } finally {
                    setLoading(false);
                }
            };

            helper();
        },
        []
    );


    return (
        <div>
            <h1>List of workshops</h1>
            <hr />

            {loading === true && (
                <div className="d-flex justify-content-center">
                    <Spinner
                        animation="border"
                        role="status"
                        variant="dark"
                    >
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            )}

            {error !== null && loading === false && (
                <Alert variant="danger">
                    {error.message}
                </Alert>
            )}

            {
                error === null && loading === false && (
                    <Row xs={1} md={3} lg={4}>
                        {
                            workshops.map((w) => (
                                <Col
                                    className="my-3 d-flex"
                                    key={w.id}
                                >
                                    <Item {...w} />
                                </Col>
                            ))
                        }
                    </Row>
                )
            }
        </div>
    );
};

export default WorkshopsList;
```
- In workshops app, add `components/workshops/WorkshopsList/Item/Item.js`
```jsx
import { Card, Button } from "react-bootstrap";

import './Item.scss';

const Item = ({  imageUrl, id, name, location, startDate, endDate }) => {
    return (
        <Card className="w-100 p-3">
            <div className="card-img-top-wrapper">
                <Card.Img variant="top" src={imageUrl} alt={name} />
            </div>
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Text as="div">
                    <div>
                        {location.address}, {location.city}, {location.state}
                    </div>
                    <div>
                        {startDate}
                        <span> - </span>
                        {endDate}
                    </div>
                </Card.Text>
                <Button variant="primary">Know more</Button>
            </Card.Body>
        </Card>
    );
};

export default Item;
```
- In workshops app, add `components/workshops/WorkshopsList/Item/Item.scss`
```scss
.workshops {
    .card-img-top-wrapper {
        height: 192px;
        display: flex;
        justify-content: center;
        align-items: center;

        // nesting selectors in SCSS
        // in css this selector becomes -> .card-img-top-wrapper .card-img-top
        .card-img-top {
            width: 50%;
        }
    }

    .card-body {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 240px;
    }
}
```
- In workshops app's `App.js`, render the WorkshopsList component, and enable scoped CSS by adding the workshops CSS class defined above.
```jsx
import WorkshopsList from './components/workshops/WorkshopsList/WorkshopsList';

const App = () => {
    return (
        <div className="workshops">
            <WorkshopsList />
        </div>
    );
};

export default App;
```
- You should now be able to see the workshops list on `http://localhost:3002`
- Expose `bootstrap.js` to other MFEs, and mount WorkshopsApp in the container app. This is left as an exercise.

## Step 12: Expose WorkshopsList React component and consume it in container app
- Expose it. Add this in workshops app `config/webpack.dev.js`
```jsx
 plugins: [
    // Add this
    new ModuleFederationPlugin({
        name: 'workshops',
        filename: 'remoteEntry.js',
        exposes: {
            './WorkshopsApp': './src/bootstrap',
        },
        shared: packageJson.dependencies,
        // shared: {
        //     react: { singleton: true },
        //     'react-dom': { singleton: true },
        //     // Do not include style loaders here
        // }
    }),
]
```
- In container app, enable use of workshops app by adding this in `webpack.dev.js`
```js
remotes: {
    home: 'home@http://localhost:3001/remoteEntry.js',
    workshops: 'workshops@http://localhost:3002/remoteEntry.js',
},
```
- In conatiner app add `src/components/WorkshopsApp.js`
```js
import { mount } from 'workshops/WorkshopsApp';
import { useRef, useEffect } from 'react';

export default () => {
    const ref = useRef(null);

    useEffect(() => {
        mount(ref.current);
    }, []);

    return <div ref={ref} />;
};
```
- Show it by making this change in container app's `App.js`
```jsx
import { Container } from 'react-bootstrap';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Menu from './components/Menu/Menu';
import HomeApp from './components/HomeApp';
import WorkshopsApp from './components/WorkshopsApp';

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Menu />
                <Container className="my-4">
                    <h1>A heading in container app</h1>
                    <Routes>
                        <Route path="/" element={<HomeApp />} />
                        <Route path="/workshops" element={<WorkshopsApp />} />
                    </Routes>
                </Container>
            </BrowserRouter>
        </>
    );
};

export default App;
```
- Make sure to restart the workshops and container apps. You should be able to see workshops list on `http://localhost:3000/workshops`

## Step 13: Create and expose common React components from the container app
- __EXERCISE__: We create common components used across MFEs in the container app, and expose it to other MFEs. This can also be done in a separate shared MFE (say, __shared__). Set this MFE up. It should launch on port __3005__.
- In the shared app, install `date-fns`
```
npm i date-fns
```
- In shared app's `src/components/FormattedDate/FormattedDate.js`
```js
// https://date-fns.org/
import { format } from "date-fns";

// "PPP" is a shorthand for a long, localized date format. It is equivalent to "do MMMM yyyy"
const FormattedDate = ({ date = new Date(), dateFormat = "PPP" }) => {
  try {
    return <span>{format(new Date(date), dateFormat)}</span>;
  } catch (error) {
    return <span>Invalid date</span>;
  }
};

export default FormattedDate;
```

- In shared app's `src/components/LoadingSpinner/LoadingSpinner.js`
```jsx
import { Spinner } from "react-bootstrap";

const LoadingSpinner = ({ variant = 'success' }) => {
    return (
        <div className="d-flex justify-content-center">
            <Spinner
                animation="border"
                role="status"
                variant={variant}
            >
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    );
}

// old way of setting default value
// LoadingSpinner.defaultProps = {
//  variant: 'success'
// }

export default LoadingSpinner;
```

- In shared app's `src/components/ErrorAlert/ErrorAlert.js`
```jsx
import { Alert } from "react-bootstrap";

// props -> { error: Error }
const ErrorAlert = ({ error }) => {
    return (
        <Alert variant="danger">
            {error.message}
        </Alert>
    );
}

export default ErrorAlert;
```
- Gather all common exports into an index file at `src/components/index.js`
```js
import ErrorAlert from './ErrorAlert/ErrorAlert';
import FormattedDate from './FormattedDate/FormattedDate';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';

export { ErrorAlert, FormattedDate, LoadingSpinner };
```
- __EXERCISE__: In the App component of this shared MFE, we can render example(s) of thes components we created above. this is left as an exercise.
- __EXERCISE SOLUTION__: In shared app's `App.js`
```js
import { ErrorAlert, FormattedDate, LoadingSpinner } from './components';

const App = () => {
    return (
        <div>
            <h1>Shared App</h1>
            <hr />

            <p>This is a shared app that contains common components. It is used by other microfrontends. Here are some example usages.</p>

            <ErrorAlert error={new Error("Some error occured")} />
            <FormattedDate date={new Date()} />
            <LoadingSpinner />
        </div>
    );
};

export default App;
```
- Expose these components using the shared app's `webpack.dev.js`
```js
exposes: {
    './components': './src/components/index.js',
},
```
- Enable use of shared components in the wotkshops app. In workshops app `config/webpack.dev.js` add __shared__ as a remote
```js
plugins: [
    // Add this
    new ModuleFederationPlugin({
        name: 'workshops',
        filename: 'remoteEntry.js',
        remotes: {
            shared: 'shared@http://localhost:3005/remoteEntry.js',
        },
        exposes: {
            './WorkshopsApp': './src/bootstrap',
        },
        shared: packageJson.dependencies,
        // shared: {
        //     react: { singleton: true },
        //     'react-dom': { singleton: true },
        //     // Do not include style loaders here
        // }
    }),
]
```
- Use these common components. Firstly, in workshops app `src/components/workshops/WorkshopsList/WorkshopsList.js`
```jsx
import { ErrorAlert, LoadingSpinner } from 'container/common';
```
```jsx
const WorkshopsList = () => {
    // code...
    // ...

    return (
        <div>
            <h1>List of workshops</h1>
            <hr />

            {loading === true && (
                <LoadingSpinner />
            )}

            {error !== null && loading === false && (
                <ErrorAlert err={error} />
            )}

            {/* UI code... */}
        </div>
    );
};

export default WorkshopsList;
```
- Now, format the date in workshop app's `src/components/workshops/WorkshopsList/Item/Item.js`
```js
import { FormattedDate } from "shared/components";
```
```js
<div>
    <FormattedDate date={startDate} />
    <span> - </span>
    <FormattedDate date={endDate} />
</div>
```
- Make sure to restart the shared, workshops apps. You can view the shared MFE at `http://localhost:3005` and the updates on workshops (`http://localhost:3002`) and container (`http://localhost:3000`)
- __NOTE__: Unlike items exposed so far, the shared MFE exports actual React components (rather than something like a mount() function that needs to be called to render the UI). This makes the module less portable (eg. you decide to move to Vue / Angular). You will need to come up with an approach similar the way `mount()` function was exposed, in order to have functions that can be called to render the shared components in general (to make it usable from an Vue / Angular app for example).

## Step 14: Set up details page
- First install FontAwesome library by following the steps at https://docs.fontawesome.com/web/use-with/react (follow steps for the free version of SVG Icon package)
- Add a workshop details component at `src/components/workshops/WorkshopDetails/WorkshopDetails.js`. For now we hardcode the id of the workshop whose details have to be shown
```jsx
import { useEffect, useState } from 'react';
import { Col, Image, Row } from 'react-bootstrap';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle } from "@fortawesome/free-regular-svg-icons";

import { ErrorAlert, FormattedDate, LoadingSpinner } from "shared/components/ErrorAlert";

import { getWorkshopById } from '../../../services/workshops';

import "./WorkshopDetails.scss";

const WorkshopDetails = () => {
    const id = 1;

    const [loading, setLoading] = useState(true);
    const [workshop, setWorkshop] = useState(null);
    const [error, setError] = useState(null);

    useEffect(
        () => {
            const helper = async () => {
                setLoading(true);

                try {
                    const workshop = await getWorkshopById(id);

                    setLoading(false);
                    setWorkshop(workshop);
                } catch (error) {
                    setLoading(false);
                    setError(error);
                }
            };

            helper();
        },
        [id]
    );

    return (
        <div>
            {loading && (
                <LoadingSpinner />
            )}

            {!loading && error && (
                <ErrorAlert error={error} />
            )}

            {!loading && !error && workshop && (
                <>
                    <h1>{workshop.name}</h1>
                    <hr />
                    <Row>
                        <Col xs={12} md={4}>
                            <Image
                                src={workshop.imageUrl}
                                alt={workshop.name}
                                fluid
                            />
                        </Col>
                        <Col xs={12} md={8}>
                            <div className="mb-3">
                                <div>{workshop.time}</div>
                                <div>
                                    <FormattedDate date={workshop.startDate} />
                                    <span> - </span>
                                    <FormattedDate date={workshop.endDate} />
                                </div>
                                <div>
                                    {workshop.location.address},
                                    {workshop.location.city},
                                    {workshop.location.state}
                                </div>
                                <div>
                                    <span className="me-4">
                                        <FontAwesomeIcon icon={workshop.modes.inPerson ? faCheckCircle : faTimesCircle} className="me-1" />
                                        In person
                                    </span>
                                    <span>
                                        <FontAwesomeIcon icon={workshop.modes.online ? faCheckCircle : faTimesCircle} className="me-1" />
                                        Online
                                    </span>
                                </div>
                            </div>
                            <div dangerouslySetInnerHTML={{ __html: workshop.description }}></div>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
};

export default WorkshopDetails;
```
- Add its styles in the same folder in `WorkshopDetails.scss`
```scss
.workshops {
    .btn-child-link {
        opacity: 0.5;
    }

    .btn-active {
        opacity: 1;
    }
}
```
- Test the details page by showing it in place of the `WorkshopsList` component in the workshop app's `App.js`
```js
import WorkshopDetails from './components/workshops/WorkshopDetails/WorkshopDetails';
import WorkshopsList from './components/workshops/WorkshopsList/WorkshopsList';

const App = () => {
    return (
        <div className="workshops">
            {/* <WorkshopsList /> */}
            <WorkshopDetails />
        </div>
    );
};

export default App;
```
- You can now view the details page when opening workshops and container apps.

## Step 15: Enabling routing in remote MFEs (here, in workshops MFE)

### Overview
- We shall set up routing in 2 parts. As we know, in the container we show the App MFE, by calling its `mount()` function. We have already set up browser router (that syncs up with browser history), and enabled routing between apps so far (__home__ and __workshops__). Further routing between the components in the MFE will be taken care of by the MFE itself.
- We cannot use multiple browser router in an app (even if it is different MFEs), as the multiple MFEs will try to update the browser router on link clicks, and this will create a race condition.
    - We should use Browser Router (with its browser history object) for the __container__ MFE, and Memory Router (with its memory history, that DOES NOT sync up with browser history) for remmote MFEs.
    - Links within the child MFEs using memory router don't affect the window location.
    - We would need a communication mechanism to sync up these remote MFE click events with the container app's browser router, so that the location can be updated.
    - We will see these in this step.

### In Practice
- First set up routing using memory router in workshops app. In workshops app's `App.js`
```js

```