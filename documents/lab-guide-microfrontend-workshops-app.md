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
    - shared : 3003
    - auth : 3004

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
- Add `src/index.js`, `src/bootstrap.js` and `src/App.js` in __container__ app
- In `src/index.js`
```
import('./bootstrap');
```
- In `src/bootstrap.js`
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
- In `src/App.js`
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
- In the home app, set up `src/components/Home/Home.js` and a `mount()` function that takes care of rendering and is called immediately in standalone mode, and is exported for use in the container.
- In home app `src/components/Home/Home.js`
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
- In home app `src/App.js`
```jsx
import Home from './components/Home/Home';

const App = () => {
  return (
    <Home />
  );
};

export default App;
```
- In home app `src/bootstrap.js`
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
- In container's `webpack.dev.js`
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
- In the container app, create `src/components/HomeApp.js`. Render a container element to show the home app, call `mount()` and pass this element as the mount point.
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
- In container app's `src/App.js`
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
- In container app add `src/components/Menu/Menu.js`
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
- Include it in the container `src/App.js`. Also set up Routing using browser history.
```jsx
import { Container } from 'react-bootstrap';
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
- Let us try adding a simple style in home app's `src/components/Home/Home.scss`
```scss
h1 {
    color: crimson;
}
```
- Include it in home app's `src/components/Home/Home.js`
```jsx
import './Home.scss';

const Home = () => {
    // code...
}
```
- The styles reflect on the page in both container and home apps. However, the styles from the home app leak on to the container app - to test this add a heading in the container app. In container app's `src/App.js`
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
- Scope the home component using the home class in home app's `src/components/Home/Home.js`
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
- Modify the style-related module loaders configuration `webpack.common.js` to so (in all apps)
```js
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
            test: /\.module\.s?css$/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        modules: {
                            localIdentName: '[name]__[local]--[hash:base64:5]', // This helps with debugging
                            exportLocalsConvention: 'camelCase',
                            namedExport: false
                        },
                        importLoaders: 1
                    }
                },
                'sass-loader',
            ],
        },
        {
            test: /\.s?css$/,
            exclude: /\.module\.s?css$/,
            use: ['style-loader', 'css-loader', 'sass-loader']
        },
    ],
},
```
- __NOTE__: If needed you can even prefix the MFE app's name in class names that are generated
```js
localIdentName: 'container__[name]__[local]--[hash:base64:5]', // container app classes prefixed with container
```
```js
localIdentName: 'home__[name]__[local]--[hash:base64:5]', // home app classes prefixed with home
```

- Define the style instead in home app's `src/components/Home/Home.module.scss`. When using Module CSS / SCSS, the styles are defined using class selector. The class names are transformed to include random characters during the build (CSS loader processes them), making them unique to the MFE defining them. Thus the a CSS class defined in one app does not affect another that defines a CSS class with the SAME name.
```scss
.heading {
    color: crimson;
}
```
- In home app's `src/components/Home/Home.js`
```jsx
import styles from './Home.module.scss';

console.log( styles );

const Home = () => {
    return (
        <div>
            <h1 className={styles.heading}>Workshops App</h1>

            {/* UI code... */}
        </div>
    );
}

export default Home;
```
- Now even if we define a class with the name `heading` in the container app, it won't affect elements with that class in the container (i.e. those components whose UI is defined by the container).


## Step 11: Add workshops list component
- __EXERCISE__: In workshops app, set up `src/index.js`, `src/bootstrap.js`, `src/App.js`. In App component import and render `WorkshopsList` from `src/components/workshops/WorkshopsList/WorkshopsList` (we create this next). Make sure the webpack config is simlar to home app (includes loaders for processing CSS etc.)
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
- In workshops app, add `src/components/workshops/WorkshopsList/WorkshopsList.js`
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
- In workshops app, add `src/components/workshops/WorkshopsList/Item/Item.js`
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
- In workshops app, add `src/components/workshops/WorkshopsList/Item/Item.scss`
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
- In workshops app's `src/App.js`, render the WorkshopsList component, and enable scoped CSS by adding the workshops CSS class defined above.
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
- Expose `src/bootstrap.js` to other MFEs, and mount WorkshopsApp in the container app. This is left as an exercise.

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
- Show it by making this change in container app's `src/App.js`
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
                        <Route path="/workshops/*" element={<WorkshopsApp />} />
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
- __EXERCISE__: We create common components used across MFEs in the container app, and expose it to other MFEs. This can also be done in a separate shared MFE (say, __shared__). Set this MFE up. It should launch on port __3003__.
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
- __EXERCISE SOLUTION__: In shared app's `src/App.js`
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
            shared: 'shared@http://localhost:3003/remoteEntry.js',
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
- Make sure to restart the shared, workshops apps. You can view the shared MFE at `http://localhost:3003` and the updates on workshops (`http://localhost:3002`) and container (`http://localhost:3000`)
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
- Test the details page by showing it in place of the `WorkshopsList` component in the workshop app's `src/App.js`
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
- __NOTE__: If you use BrowserRouter for both host container MFE and remote MFEs, you will end up having links in the host MFE, that when clicked may not update remote MFE UI (especially if you viewing a page in the remote MFE, and click a link in the host MFE that links to another page in the same remote MFE). Issues would also arise when you click links in the remote MFE UI. Problems arise when there are child routes in the remote MFEs.

### In Practice
- __NOTES__
    - First set up routing using browser router for standalone mode, and memory router for use in the host container app, in workshops app.
    - When the workshops app mounts, it must also have the current url (window.location) set as initial path in the memory router using `initialEntries` option.
    - To sync the changes in the memory router (i.e. workshops app `Link`s that change memory router state) with the host app browser router state, we pass an `onNavigate` function from host app to the remote app (workshops app in our case).
        - We set `onNavigate` to be called on route state changes using `router.subscribe()`.
    - To sync the changes in the browser router (i.e. host container app `Link`s that change the browser router state, and consequently `window.location`) with the remote app memory router state (workshops app in this case), we return `onParentNavigate` function from `mount()`.
        - We set `onParentNavigate` to be called on route state changes using an effect that is triggered on pathname changes (note that we could also trigger on `search` changes but we do not have such a requirement in this app - __this is left for your exploration__).
- We set up using data router approach of React Router v6 / v7 In workshops app's `src/bootstrap.js`. The data router requires us to define `Layout.js` file for app-wide layout. Here we do not have a common layout for WorkshopsList and WorkshopDetails pages, hence the layout simply renders an `Outlet`. In workshops app add `src/Layout.js`.
- We also make sure to pass `unmount()` function back after mounting. This is needed for React to do the necessary cleanup when the workshops app is unmounted on navigating away from it in the shell container app.
```jsx
// Layout.jsx
import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <>
            <div>
                <Link to="/workshops">List of workshops</Link>
            </div>
            <Outlet />
        </>
    );
};

export default Layout;
```
- Then in workshops app's `src/bootstrap.js`
```jsx
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

const mount = (rootElement, defaultRouter, initialPath, onNavigate) => {
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

        const search = location.search;
        const pathname = location.pathname;

        console.log('workshops::bootstrap::router.subscribe::search:', search);
        console.log('workshops::bootstrap::router.subscribe::pathname:', pathname);

        if (onNavigate && typeof onNavigate === 'function') {
            console.log('workshops::bootstrap::router.subscribe::calling onNavigate');

            onNavigate({
                pathname: window.location.pathname,
                nextPathname: pathname,
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
        onParentNavigate({ nextPathname }) {
            console.log('workshops::bootstrap::onParentNavigate', nextPathname);

            // const { pathname } = history.location;
            const { pathname } = router.state.location;

            if (pathname !== nextPathname) {
                // history.push(nextPathname);
                console.log('workshops::bootstrap::onParentNavigate Navigating to nextPathname:', nextPathname);

                router.navigate(nextPathname/*, { replace: true }*/);
            }
        },
        unmount() {
            console.log('workshops::bootstrap::unmount');
            root.unmount();
        }
    };
};

if (process.env.NODE_ENV === 'development') {
    const rootElement = document.getElementById('root-workshops');

    if (rootElement) {
        console.log('workshops::bootstrap::Mounting Workshops App in isolation');

        mount(rootElement, createBrowserRouter(routes));
    }
}

export { mount };
```
- In workshop app's `src/App.js`
```js
import { RouterProvider } from 'react-router-dom';

const App = ({ router }) => {
    return (
        <div className="workshops">
            <RouterProvider router={router} />
        </div>
    );
};

export default App;
```
- In the container app let us migrate to the data router way of working for consistency (not a good idea to mix declarative routing with data routing approach).
- First add in the container app, `src/Layout.js`
```jsx
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Menu from './components/Menu/Menu';

const Layout = () => {
    return (
        <>
            <Menu />
            <Container className="my-4">
                <Outlet />
            </Container>
        </>
    );
};

export default Layout;
```
- Then in the container app's `src/App.js`
```jsx
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
```
- Now in the container app's `src/components/WorkshopsApp.js`
```jsx
import { mount } from 'workshops/WorkshopsApp';
import { useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default () => {
    const ref = useRef(null);
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const onParentNavigateRef = useRef();

    useEffect(
        () => {
            const mountResult = mount(
                ref.current,
                {
                    pathname: window.location.pathname,
                    onNavigate({ pathname, nextPathname, search }) {
                        console.log('container::WorkshopsApp::onNavigate', pathname, nextPathname, search);

                        if (pathname !== nextPathname || search !== '') {
                            navigate({
                                pathname: nextPathname,
                                search
                            });
                        }
                    }
                }
            );

            nParentNavigateRef.current = mountResult.onParentNavigate;
            
            const unmount = mountResult.unmount;

            // any clean up on unmounting workshops app can be done in the returned cleanup function
            return () => {
                console.log('container::WorkshopsApp::useEffect unmounting');
                unmount();
            };
        },
        []
    );

    useEffect(
        () => {
            console.log('container::WorkshopsApp::useEffect pathname', pathname);

            if (onParentNavigateRef && typeof onParentNavigateRef.current === 'function') {
                console.log('container::WorkshopsApp::useEffect Calling onParentNavigate', pathname);

                onParentNavigateRef.current({
                    nextPathname: pathname,
                });
            }
        },
        [pathname]
    );

    return <div ref={ref} />;
};
```
- You should now be able to navigate between the workshop list and details pages without issues, both in the standalone workshops app, and the host container app.
- __IMPORTANT__: Make sure to understand 100% the communication and syncing up, of state of the host container app's browser router, and the remote workshop app's memory router.

## Step 16: EXERCISE: Unmounting HomeApp
- Modify `mount()` of home app to return the `unmount` function from it. In shell container app, get hold of `unmount` when mounting `HomeApp`. Make sure to set up unmounting when navigating away from the the home app. This is left as an exercise

## Step 17: Exercise: Implement Pagination using the following pagination component, and server-side enabled category filtering
- __GIVEN__: Add this in shared app's `src/components/Pagination/Pagination.js`
```jsx
const Pagination = (
    {
        page,
        disablePrevious = false,
        disableNext = false,
        onPrevious = () => { },
        onNext = () => { },
    }
) => {
    return (
        <>
            <button
                className="btn btn-sm btn-primary me-2"
                onClick={() => onPrevious(1)}
                disabled={disablePrevious || page === 1}
            >
                Previous
            </button>
            <button
                className="btn btn-sm btn-primary"
                onClick={() => onNext(1)}
                disabled={disableNext}
            >
                Next
            </button>
            <div>You are viewing page {page}</div>
        </>
    );
}

export default Pagination;
```
- __GIVEN__: And this modified `getWorkshops()` service method in workshops app's `src/services/workshops.js`
```js
const getWorkshops = async (page = 1, category = '') => {
    const params = {
        _page: page,
    };

    if (category !== '') {
        params.category = category;
    }

    const response = await axios.get(
        `${baseUrl}/workshops`,
        {
            params,
        }
    );

    return response.data;
};
```
- __EXERCISE__: Use these in workshops app's `WorkshopsList.js` to implement pagination, and server-side enabled category filtering
- __SOLUTION__: First add `Pagination` component as an export in shared app's `src/components/index.js`
```js
import ErrorAlert from './ErrorAlert/ErrorAlert';
import FormattedDate from './FormattedDate/FormattedDate';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';
import Pagination from './Pagination/Pagination';

export { ErrorAlert, FormattedDate, LoadingSpinner, Pagination };
```
- Now use this and the modified service in workshop app's `src/components/workshops/WorkshopsList/WorkshopsList.js`
```jsx
import { useEffect, useState } from 'react';
import { Alert, Col, Row, Spinner } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";

import { ErrorAlert, LoadingSpinner, Pagination } from 'shared/components';

import Item from './Item/Item';

import { getWorkshops } from '../../../services/workshops';

const WorkshopsList = () => {
    const [loading, setLoading] = useState(true);
    const [workshops, setWorkshops] = useState([]);
    const [error, setError] = useState(null);

    // ?page=2&category=frontend
    const [searchParams, setSearchParams] = useSearchParams();

    // Default to page 1
    const page = +(searchParams.get("page") || "1");
    // Default to no category (empty string)
    const category = searchParams.get("category") || "";

    const previous = (by) => {
        if (page <= 1) {
            return;
        }

        // ?page=2&category=frontend -> // ?page=1&category=frontend
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', '' + (page - by));
        setSearchParams(newParams);
    };

    const next = (by) => {
        // ?page=1 -> ?page=2
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', '' + (page + by));
        setSearchParams(newParams);
    };

    const setCategory = (category) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('category', category);
        setSearchParams(newParams);
    };

    useEffect(
        () => {
            setLoading(true);

            const helper = async () => {
                try {
                    const workshops = await getWorkshops(page, category);
                    setWorkshops(workshops);
                } catch (error) {
                    setError(error);
                } finally {
                    setLoading(false);
                }
            };

            helper();
        },
        [page, category]
    );

    return (
        <div>
            <h1>List of workshops</h1>
            <hr />

            <div className="my-4">
                <Pagination
                    page={page}
                    disablePrevious={loading}
                    disableNext={loading}
                    onPrevious={previous}
                    onNext={next}
                />
            </div>

            <div>
                <div className="btn-group my-3" role="group" aria-label="Filter by category">
                    <button type="button" className="btn btn-primary" onClick={() => setCategory('')}>All</button>
                    <button type="button" className="btn btn-danger" onClick={() => setCategory('frontend')}>Frontend</button>
                    <button type="button" className="btn btn-warning" onClick={() => setCategory('backend')}>Backend</button>
                    <button type="button" className="btn btn-success" onClick={() => setCategory('devops')}>Devops</button>
                    <button type="button" className="btn btn-info" onClick={() => setCategory('language')}>Language</button>
                    <button type="button" className="btn btn-light" onClick={() => setCategory('mobile')}>Mobile</button>
                    <button type="button" className="btn btn-dark" onClick={() => setCategory('database')}>Database</button>
                </div>
            </div>

            {loading === true && (
                <LoadingSpinner />
            )}

            {error !== null && loading === false && (
                <ErrorAlert err={error} />
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
- __IMPORTANT__: Note especially how the search params changes in the memory router of the workshops app, syncs up with the browser router of the host container app (thus reflecting in the window location, i.e. address bar in the browser).

## 18: Fetching the details of the correct workshop
- Now that we have enabled routing let us fetch the details of the correct workshop in the workshop app's `src/components/workshops/WorkshopDetails/WorkshopDetails.js`
```jsx
import { useParams } from 'react-router-dom';
```
```jsx
const WorkshopDetails = () => {
    const { id } = useParams();
}
```
- You should now be able to see the details of the correct workshop now.

## Step 19: Adding child routing in workshop details page
- Create 2 components which shall be set up as child routes of the workshop details page (which itself appears on `workshops/:id`)
    - Sessions list shows up on `workshops/:id` (aka index path as it matches the parent workshop details path)
    - Add session form shows up on `workshops/:id/add`
- Create workshop app `src/components/WorkshopDetails/SessionsList/SessionsList.js`
```jsx
const SessionsList = () => {
    return (
        <div>SessionsList works!</div>
    );
};

export default SessionsList;
```
- Create workshop app `src/components/WorkshopDetails/AddSession/AddSession.js`
```jsx
const AddSession = () => {
    return (
        <div>AddSession works!</div>
    );
};

export default AddSession;
```
- Set up child routes configuration in workshop app's `src/bootstrap.js`
```jsx
import SessionsList from './components/workshops/WorkshopDetails/SessionsList/SessionsList';
import AddSession from './components/workshops/WorkshopDetails/AddSession/AddSession';
```
```jsx
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
                children: [
                    {
                        index: true, // matches /workshops/:id
                        element: <SessionsList />
                    },
                    {
                        path: 'add', // matches /workshops/:id/add
                        element: <AddSession />
                    }
                ]
            }
        ]
    }
];
```
- Make the following changes in workshop app's `src/components/workshops/WorkshopDetails/WorkshopDetails.js`. Note how `Outlet` is used here to show the corresponding child components for the child routes.
```jsx
import { NavLink, Outlet } from 'react-router-dom';
```
```jsx
import "./WorkshopDetails.scss";
```
```jsx
const WorkshopDetails = () => {
    // code...
    // ...

    return (
        <div>
            {/* UI code... */}

            <div className="mt-5">
                <NavLink
                    to={"/workshops/" + id}
                    end
                    className={
                        ({ isActive }) => "btn btn-primary btn-sm btn-child-link me-2 " + (isActive ? "btn-active" : "")
                    }
                >
                    Sessions List
                </NavLink>
                <NavLink
                    to={"/workshops/" + id + "/add"}
                    className={
                        ({ isActive }) => "btn btn-primary btn-sm btn-child-link" + (isActive ? "btn-active" : "")
                    }
                >
                    Add a session
                </NavLink>
            </div>

            <div className="my-4">
                <Outlet />
            </div>
        </div>
    );
};

export default WorkshopDetails;
```
- Add its styles in the same folder in `WorkshopDetails.scss`
```scss
.workshops {
    .btn-child-link {
        opacity: 0.65;
        transition: opacity 0.3s ease-in-out;

        &:hover {
            opacity: 1;
        }
    }

    .btn-active {
        opacity: 1;
    }
}
```
- You should be able to navigate find between the child routes in both workshops app (standalone), and host container app.

## Step 20: Add sessions related service methods
- Create workshops app `src/services/sessions.js`
```jsx
import axios from "axios";

const baseUrl = `https://workshops-server.onrender.com`;

const getSessionsForWorkshop = async (workshopId) => {
    const response = await axios.get(
        `${baseUrl}/workshops/${workshopId}/sessions`
    );

    return response.data;
};

const voteForSession = async (sessionId, voteType) => {
    // we generally pass data in PUT request. In this case we don't have any data.
    const response = await axios.put(
        `https://workshops-server.onrender.com/sessions/${sessionId}/${voteType}`
    );

    return response.data;
};

const postSession = async (session) => {
    const response = await axios.post(
        `https://workshops-server.onrender.com/sessions`,
        session,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    return response.data;
};

export { getSessionsForWorkshop, voteForSession, postSession };
```

## Step 21: Implement a shared VotingWidget component for use in SessionsList (which has voting feature)
- First install FontAwesome library by following the steps at https://docs.fontawesome.com/web/use-with/react (follow steps for the free version of SVG Icon package)
- In shared app add `src/components/VotingWidget/VotingWidget.js`
```jsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";

import './VotingWidget.scss';

const VotingWidget = ({ votes, vote }) => {
    return (
        <div className="voting-widget">
            <FontAwesomeIcon
                icon={faCaretUp}
                onClick={() => vote('upvote')}
                className="fa-2x voting-widget-button"
            />
            <span className="voting-widget-votes">{votes}</span>
            <FontAwesomeIcon
                icon={faCaretDown}
                onClick={() => vote('downvote')}
                className="fa-2x voting-widget-button"
            />
        </div>
    );
}

export default VotingWidget;
```
- In `src/components/VotingWidget/VotingWidget.scss`
```scss
.voting-widget {
    display: flex;
    flex-direction: column;
    align-items: center;

    .voting-widget-button {
        cursor: pointer;
    }

    .voting-widget-votes {
        font-size: 1.5em;
    }
}
```
- Include it as an export available to other MFEs. In `src/components/index.js`
```js
import ErrorAlert from './ErrorAlert/ErrorAlert';
import FormattedDate from './FormattedDate/FormattedDate';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';
import Pagination from './Pagination/Pagination';
import VotingWidget from './VotingWidget/VotingWidget';

export { ErrorAlert, FormattedDate, LoadingSpinner, Pagination, VotingWidget };
```

## Step 22: Implement the SessionsList component features
- In workshop app's `src/components/workshops/WorkshopDetails/SessionsList/SessionsList.js`
```jsx
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, ListGroup, Row } from "react-bootstrap";
// import { toast } from "react-toastify";

import { ErrorAlert, LoadingSpinner } from 'shared/components';
import Item from "./Item/Item";

import { getSessionsForWorkshop, voteForSession } from "../../../../services/sessions";

const SessionsList = () => {
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState([]);
    const [error, setError] = useState(null);

    useEffect(
        () => {
            const helper = async () => {
                setLoading(true);

                try {
                    const sessions = await getSessionsForWorkshop(id);

                    setLoading(false);
                    setSessions(sessions);
                } catch (error) {
                    setLoading(false);
                    setError(error);
                }
            };

            helper();
        },
        [id]
    );

    const vote = useCallback(
        async (
            sessionId,
            voteType
        ) => {
            try {
                const updatedSession = await voteForSession(sessionId, voteType);
                setSessions(
                    sessions => sessions.map(s => s.id === sessionId ? updatedSession : s)
                );
                // toast('You vote for session ' + updatedSession.name + ' has been captured');
                alert('You vote for session ' + updatedSession.name + ' has been captured');
            } catch (error) {
                // toast(error.message);
                alert(error.message);
            }
        },
        [voteForSession, setSessions/*, toast */]
    );

    return (
        <div>
            <h2>List of Sessions</h2>

            <hr />

            {loading && (
                <LoadingSpinner />
            )}

            {!loading && error && (
                <ErrorAlert error={error} />
            )}

            {!loading && !error && (
                <ListGroup>
                    {sessions.map((s, idx) => (
                        <ListGroup.Item key={s.id}>
                            <Item
                                session={s}
                                vote={(voteType) => vote(s.id, voteType)}
                            />
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </div>
    );
};

export default SessionsList;
```
- In `src/components/workshops/WorkshopDetails/SessionsList/Item/Item.js`
```jsx
import { memo } from 'react';
import { Col, Row } from "react-bootstrap";
import { VotingWidget } from 'shared/components';

const Item = memo(
    ({ session, vote }) => {
        const { id, name, speaker, level, abstract, duration, upvoteCount } = session;

        return (
            <Row>
                <Col
                    xs={1}
                    className="d-flex flex-column justify-content-center align-items-center"
                >
                    <VotingWidget
                        votes={upvoteCount}
                        vote={vote}
                    />
                </Col>
                <Col xs={11}>
                    <h3>{name}</h3>
                    <div>by {speaker}</div>
                    <div>{level}</div>
                    <div>Duration: {duration}</div>
                    <div>{abstract}</div>
                </Col>
            </Row>
        )
    }
);

export default Item;
```
- You should now be able to see the list of sessions, and vote for session in both workshops app (standalone), and the host container app

## Step 23: Implement the AddSession component features
- In the workshops app, install `react-hook-form` for form validation
```
npm i react-hook-form
```
- In workshop app's `src/components/workshops/WorkshopDetails/AddSession/AddSession.js`
```jsx
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
// import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

import { postSession } from '../../../../services/sessions';

const AddSession = () => {
    const { id } = useParams();;
    const navigate = useNavigate();

    const { register, formState: { errors }, getValues, handleSubmit } = useForm({
        mode: 'all'
    });

    const validateDurationAndLevel = () => {
        const duration = +getValues('duration');
        const level = getValues('level');

        if (level === 'Basic' && duration < 1) {
            return 'Basic level shold have minimum 1 hour duration';
        }

        if (level === 'Intermediate' && duration < 2) {
            return 'Intermediate level shold have minimum 2 hours duration';
        }

        if (level === 'Advanced' && duration < 3) {
            return 'Advanced level shold have minimum 3 hours duration';
        }

        return true;
    };

    const addSession = async (sessionData) => {
        const session = {
            ...sessionData,
            workshopId: id,
            upvoteCount: 0,
            sequenceId: +sessionData.sequenceId,
            duration: +sessionData.duration,
        };

        console.log(session);

        try {
            const newSession = await postSession(session);
            // toast("New session was added");
            alert("New session was added");
            navigate("/workshops/" + id);
        } catch (error) {
            // toast(error.message);
            alert(error.message);
        }
    };

    return (
        <div>
            <h1 className="d-flex justify-content-between align-items-center">
                Add a Session
                <Link to=".." className="btn btn-primary">
                    List of sessions
                </Link>
            </h1>

            <hr />

            <Form onSubmit={handleSubmit(addSession)}>
                <Form.Group className="mb-4" controlId="sequenceId">
                    <Form.Label>Sequence ID</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="The Sequence ID of the session (eg. 1, 2, 3...)"
                        {...register('sequenceId', { required: true, pattern: /^\d+$/ })}
                    />
                    {
                        errors.sequenceId && (
                            <div className="text-danger">
                                {
                                    errors.sequenceId?.type === 'required' && (
                                        <div>This field is required</div>
                                    )
                                }
                                {
                                    errors.sequenceId?.type === 'pattern' && (
                                        <div>Sequence ID must be a positive integer</div>
                                    )
                                }
                            </div>
                        )
                    }
                </Form.Group>
                <Form.Group className="mb-4" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Name of the session, Eg. Programming 101 - Introduction to programming"
                        {...register('name', { required: true, pattern: /^[A-Za-z\d][A-Za-z\d .,'&_\/:+#@-]*$/ })}
                    />
                    {
                        errors.name && (
                            <div className="text-danger">
                                {
                                    errors.name?.type === 'required' && (
                                        <div>This field is required</div>
                                    )
                                }
                                {
                                    errors.name?.type === 'pattern' && (
                                        <div>Name of the session has characters that are not allowed - Must begin with alphanumeric, and can have alphanumeric, spaces, and these characters only - .,'&_/:+#@-</div>
                                    )
                                }
                            </div>
                        )
                    }
                </Form.Group>
                <Form.Group className="mb-4" controlId="speaker">
                    <Form.Label>Speaker</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Name of the speaker(s). Eg. John Doe, Jane Doe"
                        {...register('speaker', { required: true, pattern: /^[A-Za-z][A-Za-z ]*(,\s*[A-Za-z][A-Za-z ]*)*$/ })}
                    />
                    {
                        errors.speaker && (
                            <div className="text-danger">
                                {
                                    errors.speaker?.type === 'required' && (
                                        <div>This field is required</div>
                                    )
                                }
                                {
                                    errors.speaker?.type === 'pattern' && (
                                        <div>Comma-separated name(s) of speaker(s)</div>
                                    )
                                }
                            </div>
                        )
                    }
                </Form.Group>
                <Form.Group className="mb-4" controlId="duration">
                    <Form.Label>Duration</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="The duration of the session in hours (eg. 2.5)"
                        {...register('duration', { required: true, pattern: /^\d+(\.\d+)?$/ })}
                    />
                    {
                        errors.duration && (
                            <div className="text-danger">
                                {
                                    errors.duration?.type === 'required' && (
                                        <div>This field is required</div>
                                    )
                                }
                                {
                                    errors.duration?.type === 'pattern' && (
                                        <div>Only number with optional decimal part allowed</div>
                                    )
                                }
                            </div>
                        )
                    }
                </Form.Group>
                <Form.Group className="mb-4" controlId="level">
                    <Form.Label>Level</Form.Label>
                    <Form.Select
                        aria-label="Level"
                        {...register('level', { required: true, validate: validateDurationAndLevel })}
                    >
                        <option disabled>-- Select the level --</option>
                        <option value="Basic">Basic</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </Form.Select>
                    {
                        errors.level && (
                            <div className="text-danger">
                                {
                                    errors.level?.type === 'required' && (
                                        <div>This field is required</div>
                                    )
                                }
                                {
                                    errors.level?.type === 'validate' && (
                                        <div>The duration in insufficient for the selected level</div>
                                    )
                                }
                            </div>
                        )
                    }
                </Form.Group>
                <Form.Group className="mb-4" controlId="abstract">
                    <Form.Label>Abstract</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        {...register('abstract', { required: true, minLength: 20, maxLength: 1024 })}
                    />
                    {
                        errors.abstract && (
                            <div className="text-danger">
                                {
                                    errors.abstract?.type === 'required' && (
                                        <div>This field is required</div>
                                    )
                                }
                                {
                                    errors.abstract?.type === 'minLength' && (
                                        <div>Minimum 20 characters needed</div>
                                    )
                                }
                                {
                                    errors.abstract?.type === 'maxLength' && (
                                        <div>Maximum 1024 characters allowed</div>
                                    )
                                }
                            </div>
                        )
                    }
                </Form.Group>

                <Button type="submit">Add a session</Button>
            </Form>
        </div>
    );
};

export default AddSession;
```
- You should now be able to add a session, in both workshops app (standalone), and the host container app

