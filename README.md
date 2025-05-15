# Microfrontends (Using React)
- Training at Ernst & Young
- May 12 - 15, 2025
- 9:30 AM - 1:30 PM IST

---

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
- Enable use of shared components in the workshops app. In workshops app `config/webpack.dev.js` add __shared__ as a remote
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

import { ErrorAlert, FormattedDate, LoadingSpinner } from "shared/components";

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

        if (rootElement) {
            mount(
                rootElement,
                {
                    defaultRouter: createBrowserRouter(routes)
                }
            );
        }
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
                    initialPath: window.location.pathname,
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

            onParentNavigateRef.current = mountResult.onParentNavigate;
            
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
- In the workshops app `src/components/workshops/WorkshopsList/Item/Item.js` add a link to the details page
```js
import { Link } from 'react-router-dom';
```
```js
<Link to={"/workshops/" + id}>
    <Button variant="primary">Know more</Button>
</Link>
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

## Step 24: Communication strategies (between MFEs using the same UI framework - say, React)
- __NOTES__:
    - We would like to share state between MFEs. Here we see some strategies for sharing state globally. If MFEs are mounted independently like we have earlier, state sharing / communication mechanisms like Context API, become difficult as they are scoped to root of the application, and when we mount remote MFEs, we end up creating multiple React DOM root elements (`createRoot()` called by the shell container app, and again by the remote MFE when it is rendered). Context sharing become very difficult in such cases, and can involve having separate contexts and syncing up one when the other changes (much like how we synced up history router in shell container MFE and memory router in remote MFE).
    - We limit discussion to only MFEs that ALL use React here. This way we need not use `mount()` to mount the component. Again, we need not resort to using separate browser router and memory router in such cases (we can assume the shell app renders the app in a `BrowserRouter`, and the remote MFEs set up their components to be rendered using `Route`. In standalone mode we need to hoever take care to render them in a BrowserRouter).
    - Since we have adopted a data router approach, and set up workshops app using its own `RouterProvider` with `routes` created and passed to it, the workshop app's `App` component cannot directly be used in the shell container app (`RouterProvider` cannot be nested). So the `App` component cannot be directly rendered inside the shell container app. We shall instead take the example of Home component to illustrate Context API-based communication

### Sharing global state using Context API
- Let us have a global shared theme (light / dark). We first set up the context in the shared app's `src/contexts/theme.js`
```jsx
import { createContext, useContext, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light'); // or load from localStorage

    const contrastTheme = theme === 'light' ? 'dark' : 'light';

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, contrastTheme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
```
- Since we may have many such shared contexts, we choose here to export contexts through a common file. In shared app's `src/contexts/index.js`, we re-export these definitions (import followed by export).
```js
export * from './theme';
```
- __EXERCISE__: Create a component in the shared app to test the context is able to maintain and share theme state.
- Expose this in shared app's `config/webpack.dev.js`
```js
exposes: {
    './components': './src/components/index.js',
    './contexts': './src/contexts/index.js',
},
```
- Next we include shared app as a remote in the home app. In home app's `webpack.dev.js`
```js
remotes: {
    container: 'container@http://localhost:3000/remoteEntry.js',
    shared: 'shared@http://localhost:3003/remoteEntry.js',
},
```
- In home app's `src/components/Home/Home.js` we set up to consume the theme context
```jsx
import { useTheme } from 'shared/contexts';

// import './Home.scss';
import styles from './Home.module.scss';

const Home = () => {
    const { theme, contrastTheme } = useTheme();

    return (
        <div className={`home p-5 bg-${theme} text-${contrastTheme}`}>
            <h1 className={styles.heading}>Workshops App</h1>

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
        </div>
    );
}

export default Home;
```
- Also define a simple `ThemeToggler` component for testing if the Home component renders with the correct theme, and reacts to theme changes. In `src/components/ThemeToggler/ThemeToggler.js`. Later we set up to __show this component in only standalone mode__.
```jsx
import { Button } from "react-bootstrap";
import { useTheme } from "shared/contexts";

const ThemeToggler = () => {
    const { toggleTheme } = useTheme();

    return (
        <Button
            variant="outline-primary"
            onClick={toggleTheme}
        >
            Toggle theme
        </Button>
    );
};

export default ThemeToggler;
```
- The theme context will be provided by the shell container app. But we still need a theme provider when it is run in standalone mode. So we make the following changes in home app's `bootstrap.js`. We essentialy have included a mode passed as an options argument to `mount()`. We use this to decide whether to render the home app with a `ThemeProvider` (standalone), or not (when hosted in the shell container app).
```jsx
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'shared/contexts';
import ThemeToggler from './components/ThemeToggler/ThemeToggler';

import 'bootstrap/dist/css/bootstrap.css';

import App from './App';

// Mount function to start up the app
const mount = (rootElement, { mode = 'hosted' } = {}) => {
    const root = createRoot(rootElement);

    let el;

    if (mode === 'standalone') { // standalone, hence the theme will be provided by self
        el = (
            <ThemeProvider>
                <ThemeToggler />
                <App />
            </ThemeProvider>
        );
    } else { // hosted, hence the theme will be provided by the host container app
        el = <App />;
    }

    root.render(el);

    return {
        unmount() {
            root.unmount();
        }
    }
};

if (process.env.NODE_ENV === 'development') {
    const rootElement = document.getElementById('root-home');

    if (rootElement) {
        mount(rootElement, { mode: 'standalone' });
    }
}

export { mount };
```
- Start the home app in standalone mode, and verify it works fine. You should be able to toggle the theme.
- As discussed in the notes above, we shall not work in a framework-agnostic mode when rendering the home app (we assume __React__ across the apps under discussion). Let us expose the Home component from the home app. In home app's `webpack.dev.js`
```js
exposes: {
    './HomeApp': './src/bootstrap',
    './HomeAppComponent': './src/App',
},
```
- Add shared app as remote in shell container app's `webpack.dev.js`
```js
remotes: {
    // existing remotes...
    shared: 'shared@http://localhost:3003/remoteEntry.js',
},
```
- Now in the container app's `App.js` make the following changes
```jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { ThemeProvider } from 'shared/contexts';

import Layout from './Layout';

// import HomeApp from './components/HomeApp';
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
```
- Add the theme toggling code in container component's `src/components/Menu/Menu.js`
```jsx
import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { useTheme } from 'shared/contexts';

import './Menu.scss';

const Menu = () => {
    const { theme, contrastTheme, toggleTheme } = useTheme();

    return (
        <Navbar collapseOnSelect expand="lg" variant={theme} className={`bg-${theme}`}>
            <Container>
                <Navbar.Brand as={NavLink} to="/">Workshops App</Navbar.Brand>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
                        <Nav.Link as={NavLink} to="/workshops" end>List of workshops</Nav.Link>
                    </Nav>
                    <NavDropdown title="Personalize" id="basic-nav-dropdown" className={`text-${contrastTheme}`}>
                        <NavDropdown.Item as={NavLink} to="/workshops/favorites">
                            Favorites
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#" onClick={toggleTheme}>
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
- Make sure to restart the shared, home and container apps. You container app should work fine, and you should be able to toggle the theme.

### Sharing global state using Redux Store
- Install Redux libraries - Redux Toolkit (RTK), and React Redux in all apps (some may not need one of them though)
```
npm i @reduxjs/toolkit react-redux
```
- In shared module, add `src/store/features/themeSlice.js`
```js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: "light",
    contrastValue: "dark",
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleTheme(curState /*, payload */) {
            curState.contrastValue = curState.value;
            curState.value = curState.value === "light" ? "dark" : "light";
        },
    },
});

export const selectTheme = (state) => state.theme;
export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
```
- Define the Redux store in shared app's `src/store/index.js`
```js
import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./features/themeSlice";

const store = configureStore({
    reducer: {
        theme: themeReducer
    },
});

export default store;
```
- __EXERCISE__: Create a component in the shared app to test the store's is able to maintain and share theme state.
- Expose the store and themeSlice. In shared app's `webpack.dev.js`
```js
exposes: {
    './components': './src/components/index.js',
    './contexts': './src/contexts/index.js',
    './features/themeSlice': './src/store/features/themeSlice.js',
    './store': './src/store/index.js',
},
```
- Make sure shared app is a configured remote in home and shell container apps
- In home app's `src/components/Home/Home.js` we set up to consume the theme state from the store
```jsx
// import './Home.scss';
import { useSelector } from 'react-redux';

import { selectTheme } from 'shared/features/themeSlice';

import styles from './Home.module.scss';

const Home = () => {
    const { value, contrastValue } = useSelector(selectTheme)

    return (
        <div className={`home p-5 bg-${value} text-${contrastValue}`}>
            <h1 className={styles.heading}>Workshops App</h1>

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
        </div>
    );
}

export default Home;
```
- Make changes to the `ThemeToggler` component for testing if the Home component renders with the correct theme, and reacts to theme changes. In `src/components/ThemeToggler/ThemeToggler.js`. Note that we have set up to __show this component in only standalone mode__.
```jsx
import { Button } from "react-bootstrap";
import { useDispatch } from 'react-redux';

import { toggleTheme } from 'shared/features/themeSlice';

const ThemeToggler = () => {
    const dispatch = useDispatch();

    return (
        <Button
            variant="outline-primary"
            onClick={() => dispatch(toggleTheme())}
        >
            Toggle theme
        </Button>
    );
};

export default ThemeToggler;
```
- The theme store will be provided by the shell container app. But we still need a store provider when it is run in standalone mode. So we make the following changes in home app's `bootstrap.js`. We essentialy have included a mode passed as an options argument to `mount()`. We use this to decide whether to render the home app with a `react-redux` `Provider` (standalone), or not (when hosted in the shell container app).
```jsx
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import store from 'shared/store';

import 'bootstrap/dist/css/bootstrap.css';

import App from './App';
import ThemeToggler from './components/ThemeToggler/ThemeToggler';

// We shall call this from here, as well as host MFE (say, container) - rootElement can be different from what's here in the host MFE (say, container)
const mount = (rootElement, { mode = 'hosted' } = {}) => {
    const root = createRoot(rootElement);

    let el;

    if (mode === 'standalone') {
        el = (
            <Provider store={store}>
                <ThemeToggler />
                <App />
            </Provider>
        );
    } else {
        el = <App />
    }

    root.render(el);

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
        mount(rootElement, { mode: 'standalone' });
    }
}

// export it, so that we can call mount() in host MFEs (say, container)
export { mount }
```
- Start the home app in standalone mode, and verify it works fine. You should be able to toggle the theme.
- Provide the Redux store in container app's `App.js` (we have replaced the Context API related code - you may save a copy of it in another file for reference)
```jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from 'shared/store';

import Layout from './Layout';

// import HomeApp from './components/HomeApp';
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
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    );
};

export default App;
```
- Consume the store in the containers app's `src/components/Menu/Menu.js` in order to set up theme and toggling of the theme. Again, we have replaced theme context related code - save a copy if you wish.
```jsx
import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { useDispatch, useSelector } from 'react-redux';

import { toggleTheme, selectTheme } from 'shared/features/themeSlice';

import './Menu.scss';

const Menu = () => {
    const dispatch = useDispatch();
    const { value: theme, contrastValue: contrastTheme } = useSelector(selectTheme);

    return (
        <Navbar collapseOnSelect expand="lg" variant={theme} className={`bg-${theme}`}>
            <Container>
                <Navbar.Brand as={NavLink} to="/">Workshops App</Navbar.Brand>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
                        <Nav.Link as={NavLink} to="/workshops" end>List of workshops</Nav.Link>
                    </Nav>
                    <NavDropdown title="Personalize" id="basic-nav-dropdown" className={`text-${contrastTheme}`}>
                        <NavDropdown.Item as={NavLink} to="/workshops/favorites">
                            Favorites
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#" onClick={() => dispatch(toggleTheme())}>
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
- Use the theme in home app's `src/components/Home/Home.js`. Again, we have replaced theme context related code - save a copy if you wish.
```jsx
import { useSelector } from 'react-redux';

import { selectTheme } from 'shared/features/themeSlice';

// import './Home.scss';
import styles from './Home.module.scss';

const Home = () => {
    const { value: theme, contrastValue: contrastTheme } = useSelector(selectTheme);

    return (
        <div className={`home p-5 bg-${theme} text-${contrastTheme}`}>
            <h1 className={styles.heading}>Workshops App</h1>

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
        </div>
    );
}

export default Home;
```
- Make sure to restart the shared app. You container app should work fine, and you should be able to toggle the theme.
- __EXERCISE__: The changes to the home component in order to be able to make theme change now (when running in standalone mode) is left as an exercise.

### Syncing state using props, arguments, and callback functions
- The host MFE and remote MFE can communicate with each using through props, arguments, and callbacks
    - When we render a remote MFE component, we can pass props, including callbacks props (functions)
    - We can expose functions that need conditional logic (based on whether the code needs to be run in standalone mode or hosted mode), and pass arguments, including callback functions
    - These arguments can help set up slightly different ways to execute code in standalone and hosted mode of execution (if needed)
    - The arguments and callback functions (including returned values / callback functions) enable communication between host and remote MFEs
    - We saw an example of this already when mounting a remote App framework-agnostically (here the browser router state of host, and memory router state of remote was synced)
    ```js
    const mountResult = mount(
        ref.current,
        {
            initialPath: window.location.pathname,
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

    onParentNavigateRef.current = mountResult.onParentNavigate;
    ```
    - __IMPORTANT__: We can use a similar strategy to wrap up conditional code in functions, and designing arguments, callback function (both in arguments and return value) to set up communication

### Syncing state using custom events
- The browser enables triggering __custom events__, and listening to them via its event handling APIs
    - __Disadvantages__
        - You may have to __duplicate state__ in this case in the communicating MFEs (and they may occur in multiple places in one MFE), and __set up syncing of the states carefully__ since there is no single source of truth in such case. Therefore this mechanism can work for simple shared state, but needs careful consideration when you have many events, or state duplicated in many places. If not carefully set up, the states can drift apart introducing bugs in the application.
        - On the other hand, Context API and Redux enable shared state, but they also need React as the framework in communicating apps.
    - __Advantages__
        - It is simple to set up and understand - basically a pub-sub mechanism (the browser event handling APIs acting as an event bus)
        - Works even if MFEs are not loaded in the same execution contexts (an MFE is mounted rather than its component rendered by host - eg. when MFEs are buiot with different frameworks, or one MFE is loaded within an iframe). On the other hand, when using Context API / Redux store, we are tied to React for example.
        - There is loose-coupling, and we can communicate app-wide - any MFE to any other MFE without prior knowledge of who listens for the events. This advantage exists event when using Context API / Redux.
        - This does not even require any set up at the top-level UI, nor complex set up for handling rendering of the app in standalone and hosted mode.
- This is the [event handling API for working with custom events](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events) and it is [supported in all modern browsers](https://caniuse.com/?search=dispatchEvent)
```js
// App A
window.dispatchEvent(new CustomEvent('themeChanged', { detail: 'dark' }));
```
```js
// App B
window.addEventListener('themeChanged', (e) => {
  console.log('Theme:', e.detail);
});
```
- Let us now implement theming with this mechanism. In the shared app's `src/events/theme.js`
```js
/**
 * This is to be called by a component when it changes its internal theme state (or wants to effect a change in theme)
 */
const publishThemeChanged = (theme) => {
    window.dispatchEvent(
        new CustomEvent(
            'themeChanged',
            {
                detail: {
                    value: theme
                }
            }
        )
    );
};

/**
 * This is to be called when the component mounts
 * Returns the unsubscribe function which is to be called when the component unmounts
 */
const subscribeThemeChanged = (callback) => {
    const handler = (event) => {
        callback(event.detail.value);
    };

    window.addEventListener('themeChanged', handler);


    return () => {
        window.removeEventListener('themeChanged', handler);
    };
}

const getContrastTheme = (theme = 'light') => {
    return theme === 'dark' ? 'light' : 'dark';
};

export {
    publishThemeChanged,
    subscribeThemeChanged,
    getContrastTheme
};
```
- In `src/events/index.js` we gather exports from all files (right now we have only `theme.js`), and re-export.
```js
export * from './theme';
```
- In shared app's `webpack.dev.js` we expose these
```js
exposes: {
    './components': './src/components/index.js',
    './contexts': './src/contexts/index.js',
    './features/themeSlice': './src/store/features/themeSlice.js',
    './store': './src/store/index.js',
    './events': './src/events/index.js',
},
```
- In the container app's, `src/components/Menu/Menu.js`
```js
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { publishThemeChanged, subscribeThemeChanged, getContrastTheme } from 'shared/events';

import './Menu.scss';

const Menu = () => {
    const [theme, setTheme] = useState('light');
    const contrastTheme = getContrastTheme(theme);

    const toggleTheme = () => {
        const newTheme = getContrastTheme(theme);
        console.log('Theme about to be changed to', newTheme);
        setTheme(newTheme);
        publishThemeChanged(newTheme);
    };

    useEffect(
        () => {
            const unsubscribe = subscribeThemeChanged(setTheme);

            return unsubscribe;
        },
        []
    );

    return (
        <Navbar collapseOnSelect expand="lg" variant={theme} className={`bg-${theme}`}>
            <Container>
                <Navbar.Brand as={NavLink} to="/">Workshops App</Navbar.Brand>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
                        <Nav.Link as={NavLink} to="/workshops" end>List of workshops</Nav.Link>
                    </Nav>
                    <NavDropdown title="Personalize" id="basic-nav-dropdown" className={`text-${contrastTheme}`}>
                        <NavDropdown.Item as={NavLink} to="/workshops/favorites">
                            Favorites
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#" onClick={toggleTheme}>
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
- In home app's `src/components/Home/Home.js`
```jsx
import { useState, useEffect } from 'react';

import { subscribeThemeChanged, getContrastTheme } from 'shared/events';

// import './Home.scss';
import styles from './Home.module.scss';

const Home = () => {
    const [theme, setTheme] = useState('light');
    const contrastTheme = getContrastTheme(theme);

    useEffect(
        () => {
            const unsubscribe = subscribeThemeChanged((theme) => {
                console.log('Theme changed to', theme);
                setTheme(theme);
            });

            return unsubscribe;
        },
        []
    );

    return (
        <div className={`home p-5 bg-${theme} text-${contrastTheme}`}>
            <h1 className={styles.heading}>Workshops App</h1>

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
        </div>
    );
}

export default Home;
```
- __NOTE__: You can remove the context provider / Redux store provider set up in container and home apps. These are not used in this step. This is left to you.
- Make sure to restart the shared app. You container app should work fine, and you should be able to toggle the theme.
- __EXERCISE__: The changes to the home component in order to be able to make theme change now (when running in standalone mode) is left as an exercise.

### Syncing state using custom events handled using a custom event bus
- We just used the browser's event handling APIs as an event bus to effect communication between MFEs. As we saw, the support for this API is very good. However, if you prefer an independent event bus, you could use third-party libraries, or come up with your own implementatin would would be on similar lines
```js
const listeners = new Map();

export const publish = (event, data) => {
    listeners.get(event)?.forEach(fn => fn(data));
};

export const subscribe = (event, callback) => {
    if (!listeners.has(event)) listeners.set(event, []);
    listeners.get(event).push(callback);

    return () => {
        listeners.set(event, listeners.get(event).filter(fn => fn !== callback));
    };
};
```
- __EXERCISE__: An implementation using this is left as an exercise.

### Syncing state using browser's local storage
- You can use local storage to store the shared state. You can subscribe to the `localstorage` related event (`storage` fired on the `window` object) to get notified of the state changes.
```js
localStorage.setItem('theme', 'dark');
```
```js
// for subscribers - please also need to handle remove of the listener (unsubscribing)
window.addEventListener('storage', (event) => {
    if (event.key === 'theme') {
        document.body.setAttribute('data-theme', event.newValue);
    }
});
```
- __WARNING__: The window `storage` event does not fire in the tab from where the change happens! So you need to handle it specially, for example by triggering a cutom event.
```js
const setTheme = (value) => {
    localStorage.setItem('theme', value);
    window.dispatchEvent(new CustomEvent('localstorage-theme', { detail: value }));
};

window.addEventListener('localstorage-theme', (e) => {
    console.log('Theme updated in this tab:', e.detail);
});
```
- This is defintely an option to consider in MFEs and is left for your exploration. The good part if the state is not duplicated and acts as a single source of truth. Be mindful of application security in such cases.

### Communication via backend APIs
- You can avoid all forms of frontend communication if that is possible, and update the UI by simply using backend APIs (eg. RESTful API), or web sockets (recommended for real-time apps).
- Where possible, it is best to stick to this in MFEs
    - Simple to implement and use
    - No business of syncing state
    - Backend data is single source of truth
    - Not prone to bugs
    - Highly recommended, especially when the communicating MFEs are on different pages, and you need to navigate from one page to the next (and you thus fetch fresh data on the MFE page you navigate to).

## Step 25: Working with an MFE using a different framework
- Create a new folder for favorites app in `packages/favorites`
- From packages folder
```sh
mkdir favorites
```
```sh
cd favorites
```
- Create a `package.json`
```sh
npm init -y
```
- Install the dependencies
```sh
npm i -D @babel/core @babel/plugin-transform-runtime @babel/preset-env @vue/compiler-sfc babel-loader css-loader file-loader html-webpack-plugin sass sass-loader style-loader vue-loader vue-style-loader webpack webpack-cli webpack-dev-server webpack-merge
```
```sh
npm i vue bootstrap
```
- In `config/webpack.common.js`
```js
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].[contenthash].js',
  },
  resolve: {
    extensions: ['.js', '.vue'],
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|woff|svg|eot|ttf)$/i,
        use: [{ loader: 'file-loader' }],
      },
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.scss$/,
        oneOf: [
          // this matches <style module lang="scss">
          {
            resourceQuery: /module/,
            use: [
              'vue-style-loader',
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  esModule: false
                }
              },
              'sass-loader'
            ]
          },
          // this matches plain <style lang="scss"> or SCSS imported in JS
          {
            use: [
              'vue-style-loader',
              {
                loader: 'css-loader',
                options: {
                  esModule: false
                }
              },
              'sass-loader'
            ]
          }
        ]
      }
    ],
  },
  plugins: [new VueLoaderPlugin()],
};
```
- In `config/webpack.dev.js`
```js
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const commonConfig = require('./webpack.common');
const packageJson = require('../package.json');

const devConfig = {
  mode: 'development',
  output: {
    publicPath: 'http://localhost:3004/',
  },
  devServer: {
    port: 3004,
    historyApiFallback: {
      index: 'index.html',
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'favorites',
      filename: 'remoteEntry.js',
      shared: packageJson.dependencies,
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};

module.exports = merge(commonConfig, devConfig);
```
- In `config/webpack.prod.js`
```js
const { merge } = require('webpack-merge');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const packageJson = require('../package.json');
const commonConfig = require('./webpack.common');

const prodConfig = {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
    publicPath: '/favorites/latest/',
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'favorites',
      filename: 'remoteEntry.js',
      shared: packageJson.dependencies,
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig);
```
- In `public/index.html`
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Favorites</title>
    </head>
    <body>
        <div id="root-favorites"></div>
    </body>
</html>
```
- In `src/index.js`
```js
import('./bootstrap');
```
- In `src/bootstrap.js`
```js
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
```
- In `src/components/Favorites.vue`. This is a file having HTML template, CSS style, and JS style in one file - The extension is `.vue` and Vue calls such files Single File Components (SFC).
```vue
<template>
    <div>
        <h1>Favorites</h1>
        <hr />
        {{ message }}
    </div>
</template>

<script>
export default {
    name: "Favorites",
    data() {
        return {
            message: "Your favorite workshops will be displayed here.",
        };
    },
};
</script>

<style lang="scss" scoped>
h1 {
    color: olive;
}
</style>
```
- In favorites app `package.json` add these scripts
```json
"scripts": {
    "start": "webpack serve --config config/webpack.dev.js",
    "build": "webpack --config config/webpack.prod.js"
},
```
- Start the favorites app in standalone mode
```
npm start
```
- You should be able to see the favorites component when the app loads
- Now expose the `src/bootstrap.js` file in `webpack.dev.js` and `webpack.prod.js`
```js
new ModuleFederationPlugin({
      name: 'favorites',
      filename: 'remoteEntry.js',
      exposes: {
        './FavoritesApp': './src/bootstrap',
      },
      shared: packageJson.dependencies,
}),
```
- Add favorites app as a remote in shell container app's `config/webpack.dev.js`
```js
remotes: {
    // existing remotes...
    favorites: 'favorites@http://localhost:3004/remoteEntry.js',
},
```
- Define `FavoritesApp` in container app's `src/components/FavoritesApp.js`
```js
import { mount } from 'favorites/FavoritesApp';
import { useRef, useEffect } from 'react';

export default () => {
    const ref = useRef(null);

    useEffect(
        () => {
            const mountResult = mount(ref.current);

            const unmount = mountResult.unmount;

            return () => {
                console.log('container::FavoritesApp::useEffect unmounting');
                unmount();
            };
        },
        []
    );

    return <div ref={ref}></div>;
};
```
- In container app's `src/App.js`
```js
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from 'shared/store';

import Layout from './Layout';

// import HomeApp from './components/HomeApp';
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
```

- Make sure restart the favorites and container apps. You should be able to navigate to the favorites page in the container app, and see it.

## Step 26: Deploying the app in production

### Set up production webpack configurations for all apps
- In container app's `config/webpack.prod.js`
```js
const { merge } = require('webpack-merge');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const commonConfig = require('./webpack.common');
const packageJson = require('../package.json');

const domain = process.env.PRODUCTION_DOMAIN;

const prodConfig = {
    mode: 'production',
    output: {
        filename: '[name].[contenthash].js',
        publicPath: '/container/latest/',
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'container',
            remotes: {
                home: `home@${domain}/home/latest/remoteEntry.js`,
                shared: `shared@${domain}/shared/latest/remoteEntry.js`,
                workshops: `workshops@${domain}/workshops/latest/remoteEntry.js`,
                favorites: `favorites@${domain}/favorites/latest/remoteEntry.js`,
            },
            shared: {
                ...packageJson.dependencies,
                'css-loader': {
                    singleton: true,
                    requiredVersion: packageJson.dependencies['css-loader'],
                },
                react: {
                    singleton: true,
                    requiredVersion: packageJson.dependencies.react,
                },
                'react-dom': {
                    singleton: true,
                    requiredVersion: packageJson.dependencies['react-dom'],
                },
                'react-router-dom': {
                    singleton: true,
                    requiredVersion: packageJson.dependencies['react-router-dom'], // or whatever version you're using
                },
            }
        }),
    ],
};

module.exports = merge(commonConfig, prodConfig);
```
- Set up build script in container app's `package.json`
```
"build": "webpack --config config/webpack.prod.js"
```
- Run build.
```
npm run build
```
- Check the `dist` folder is generated fine and delete it.
- Setup home app's `config/webpack.prod.js`
```js
const { merge } = require('webpack-merge');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const packageJson = require('../package.json');
const commonConfig = require('./webpack.common');

const domain = process.env.PRODUCTION_DOMAIN;

const prodConfig = {
    mode: 'production',
    output: {
        filename: '[name].[contenthash].js',
        publicPath: '/home/latest/',
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'home',
            filename: 'remoteEntry.js',
            exposes: {
                './HomeApp': './src/bootstrap',
                './HomeAppComponent': './src/App',
            },
            remotes: {
                shared: `shared@${domain}/shared/latest/remoteEntry.js`,
            },
            // shared: packageJson.dependencies,
            shared: {
                ...packageJson.dependencies,
                'css-loader': {
                    singleton: true,
                    requiredVersion: packageJson.dependencies['css-loader'],
                },
                react: {
                    singleton: true,
                    requiredVersion: packageJson.dependencies.react,
                },
                'react-dom': {
                    singleton: true,
                    requiredVersion: packageJson.dependencies['react-dom'],
                },
                'react-router-dom': {
                    singleton: true,
                    requiredVersion: packageJson.dependencies['react-router-dom'], // or whatever version you're using
                },
            }
        }),
    ],
};

module.exports = merge(commonConfig, prodConfig);
```
- Set up build script in home app's `package.json`
```
"build": "webpack --config config/webpack.prod.js"
```
- Run build.
```
npm run build
```
- Check the `dist` folder is generated fine and delete it.
- Setup workshops app's `config/webpack.prod.js`. Do add the build script and check the build works fine, and delete the dist folder.
```js
const { merge } = require('webpack-merge');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const packageJson = require('../package.json');
const commonConfig = require('./webpack.common');

const domain = process.env.PRODUCTION_DOMAIN;

const prodConfig = {
    mode: 'production',
    output: {
        filename: '[name].[contenthash].js',
        publicPath: '/workshops/latest/',
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'workshops',
            filename: 'remoteEntry.js',
            remotes: {
                shared: `shared@${domain}/shared/latest/remoteEntry.js`,
            },
            exposes: {
                './WorkshopsApp': './src/bootstrap',
                './WorkshopsAppComponent': './src/App',
            },
            // shared: packageJson.dependencies,
            shared: {
                ...packageJson.dependencies,
                'css-loader': {
                    singleton: true,
                    requiredVersion: packageJson.dependencies['css-loader'],
                },
                react: {
                    singleton: true,
                    requiredVersion: packageJson.dependencies.react,
                },
                'react-dom': {
                    singleton: true,
                    requiredVersion: packageJson.dependencies['react-dom'],
                },
                'react-router-dom': {
                    singleton: true,
                    requiredVersion: packageJson.dependencies['react-router-dom'], // or whatever version you're using
                },
            }
        }),
    ],
};

module.exports = merge(commonConfig, prodConfig);
```
- Setup shared app's `config/webpack.prod.js`. Do add the build script and check the build works fine, and delete the dist folder.
```js
const { merge } = require('webpack-merge');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const packageJson = require('../package.json');
const commonConfig = require('./webpack.common');

const prodConfig = {
    mode: 'production',
    output: {
        filename: '[name].[contenthash].js',
        publicPath: '/shared/latest/',
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'shared',
            filename: 'remoteEntry.js',
            exposes: {
                './components': './src/components/index.js',
                './contexts': './src/contexts/index.js',
                './features/themeSlice': './src/store/features/themeSlice.js',
                './store': './src/store/index.js',
                './events': './src/events/index.js',
            },
            // shared: packageJson.dependencies,
            shared: {
                ...packageJson.dependencies,
                'css-loader': {
                    singleton: true,
                    requiredVersion: packageJson.dependencies['css-loader'],
                },
                react: {
                    singleton: true,
                    requiredVersion: packageJson.dependencies.react,
                },
                'react-dom': {
                    singleton: true,
                    requiredVersion: packageJson.dependencies['react-dom'],
                },
                'react-router-dom': {
                    singleton: true,
                    requiredVersion: packageJson.dependencies['react-router-dom'], // or whatever version you're using
                },
            }
        }),
    ],
};

module.exports = merge(commonConfig, prodConfig);
```
- Setup favorites app's `config/webpack.prod.js`. Do add the build script and check the build works fine, and delete the dist folder.
```js
const { merge } = require('webpack-merge');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const packageJson = require('../package.json');
const commonConfig = require('./webpack.common');

const prodConfig = {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
    publicPath: '/favorites/latest/',
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'favorites',
      filename: 'remoteEntry.js',
      exposes: {
        './FavoritesApp': './src/bootstrap',
      },
      shared: packageJson.dependencies,
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig);
```

### Create a GitHub repository
- Login to github.com and create a new repository (can be public or private), say `workshops-app-mfe`
- In `workshops-app` folder (i.e. the same level as `packages/` folder) create `.gitignore` for the repository
```
npx gitignore node
```
- Initialize the local `workshops-app` folder as a Git project, commit the changes, and add the GitHub repository as a remote. Again, from the `workshops-app` folder,
```
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/puranik3/workshops-app-mfe.git
git branch -M master
git push -u origin master
```

### Setting up the CI/CD pipeline using GitHub actions
- Within `workshops-app` folder, create a `.github/workflows` folder
```
mkdir -p .github/workflows
```
- Create `.github/workflows/container.yml`. Add this in the file.
```yml
name: deploy-container

on:
  push:
    branches:
      - master
    paths:
      - 'packages/container/**'

defaults:
  run:
    working-directory: packages/container

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run build
        env:
          PRODUCTION_DOMAIN: ${{ secrets.PRODUCTION_DOMAIN }}

      - uses: shinyinc/action-aws-cli@v1.2
      - run: aws s3 sync dist s3://${{ secrets.AWS_S3_BUCKET_NAME }}/container/latest
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_DEFAULT_REGION: us-east-1

      - run: aws cloudfront create-invalidation --distribution-id ${{ secrets.AWS_DISTRIBUTION_ID }} --paths "/container/latest/index.html"
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```
- __NOTE__: The `PRODUCTION_DOMAIN` environment variable is used in the production webpack config files, and will also have to be set in the build environment in GitHub actions.

- Create `.github/workflows/home.yml`. Add this in the file.
```yml
name: deploy-home

on:
  push:
    branches:
      - master
    paths:
      - 'packages/home/**'

defaults:
  run:
    working-directory: packages/home

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run build
        env:
          PRODUCTION_DOMAIN: ${{ secrets.PRODUCTION_DOMAIN }}

      - uses: shinyinc/action-aws-cli@v1.2
      - run: aws s3 sync dist s3://${{ secrets.AWS_S3_BUCKET_NAME }}/home/latest
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_DEFAULT_REGION: us-east-1

      - run: aws cloudfront create-invalidation --distribution-id ${{ secrets.AWS_DISTRIBUTION_ID }} --paths "/home/latest/remoteEntry.js"
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```
- Create `.github/workflows/workshops.yml`. Add this in the file.
```yml
name: deploy-workshops

on:
  push:
    branches:
      - master
    paths:
      - 'packages/workshops/**'

defaults:
  run:
    working-directory: packages/workshops

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run build
        env:
          PRODUCTION_DOMAIN: ${{ secrets.PRODUCTION_DOMAIN }}

      - uses: shinyinc/action-aws-cli@v1.2
      - run: aws s3 sync dist s3://${{ secrets.AWS_S3_BUCKET_NAME }}/workshops/latest
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_DEFAULT_REGION: us-east-1

      - run: aws cloudfront create-invalidation --distribution-id ${{ secrets.AWS_DISTRIBUTION_ID }} --paths "/workshops/latest/remoteEntry.js"
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```
- Create `.github/workflows/shared.yml`. Add this in the file.
```yml
name: deploy-shared

on:
  push:
    branches:
      - master
    paths:
      - 'packages/shared/**'

defaults:
  run:
    working-directory: packages/shared

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run build
        env:
          PRODUCTION_DOMAIN: ${{ secrets.PRODUCTION_DOMAIN }}

      - uses: shinyinc/action-aws-cli@v1.2
      - run: aws s3 sync dist s3://${{ secrets.AWS_S3_BUCKET_NAME }}/shared/latest
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_DEFAULT_REGION: us-east-1

      - run: aws cloudfront create-invalidation --distribution-id ${{ secrets.AWS_DISTRIBUTION_ID }} --paths "/shared/latest/remoteEntry.js"
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```
- Create `.github/workflows/favorites.yml`. Add this in the file.
```yml
name: deploy-favorites

on:
  push:
    branches:
      - master
    paths:
      - 'packages/favorites/**'

defaults:
  run:
    working-directory: packages/favorites

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run build
        env:
          PRODUCTION_DOMAIN: ${{ secrets.PRODUCTION_DOMAIN }}

      - uses: shinyinc/action-aws-cli@v1.2
      - run: aws s3 sync dist s3://${{ secrets.AWS_S3_BUCKET_NAME }}/favorites/latest
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_DEFAULT_REGION: us-east-1

      - run: aws cloudfront create-invalidation --distribution-id ${{ secrets.AWS_DISTRIBUTION_ID }} --paths "/favorites/latest/remoteEntry.js"
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

### Setting up the AWS S3 bucket and policy
__NOTE__: You need to have an AWS account or create one to proceed!
- Login to AWS console and navigate to the AWS S3 dashboard
- Create a bucket (say, `workshops-app-mfe` - note that bucket names have to be globally unique, so you would have to change this!)
- Select and view the bucket. In properties, enable static website hosting (if not already done at bucket creation time)
    - Set index document as `index.html` and save changes
- Access the 'Permissions' tab of the chosen bucket.
    - Uncheck Block public access and save changes
- Create a policy - use policy generator 
    - choose 'S3 Bucket Policy' as the type of policy
    - Principal: '*'
    - Configure the policy to allow 'GetObject' actions for all principals.
    - Enter the correct Amazon Resource Name (ARN) for your S3 bucket in the policy. Add a `/*` at the end. Example: `arn:aws:s3:::workshops-app-mfe/*`
    - Generate the policy and copy it. It will look like this
```json
{
  "Id": "Policy1747234771579",
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Stmt1747234764237",
      "Action": [
        "s3:GetObject"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::workshops-app-mfe/*",
      "Principal": "*"
    }
  ]
}
```
- Return to the S3 bucket and edit the policy in the 'Permissions' tab.
- Paste the generated policy into the editor and save the changes.
- Also setup __AWS_DEFAULT_REGION__ from a few steps earlier (in GitHub workflows files) - copy the AWS region of your S3 bucket (eg. `us-east-1`) - this was already setup, but if your region is different, do substitute it with the right one.
    - For eg. set it in `container.yml` file
```yml
AWS_DEFAULT_REGION: us-east-1
```
    - Do similarly for other workflows files.

### Setting up CloudFront distribution
- Go to AWS Management Console and use the search bar to find CloudFront
- Click Create distribution
- Set Origin domain to your S3 bucket
- Find the Default cache behavior section and change Viewer protocol policy to Redirect HTTP to HTTPS
- Scroll down and click Create Distribution
- After Distribution creation has finalized click the Distribution from the list, find its Settings and click - Edit
- Scroll down to find the Default root object field and enter `/container/latest/index.html`
- Click Save changes
- Click Error pages
- Click Create custom error response
- Change HTTP error code to `403: Forbidden`
- Change Customize error response to `Yes`
- Set Response page path to `/container/latest/index.html`
  - Set HTTP Response Code to `200: OK`

### Create IAM user
- Search for "IAM"
- In the left sidebar, click Access Management -> Users
- Click "Create user"
- Enter any name you'd like in the __User Name__ field (eg. `github-actions-workshops-app-mfe`). Also AWS access type is Programmatic accesss / CLI access
- Click "Next"
- Click "Attach Policies Directly"
- Use the search bar to find and tick __AmazonS3FullAccess__ and __CloudFrontFullAccess__
- Click "Next"
- Click "Create user"
- Select the IAM user that was just created from the list of users
- Click "Security Credentials"
- Scroll down to find "Access Keys"
- Click "Create access key"
- Select "Command Line Interface (CLI)"
- Scroll down and tick the "I understand..." check box and click "Next"
- Copy and/or download the Access Key ID and Secret Access Key to use for deployment.
    - say in `.env.prod` and add the filename to `.gitignore`

### Copying secrets
- In GitHub repo -> Settings -> Secrets and variables -> Repository secrets -> Add them (values from IAM, S3, CloudFront)
    - Set 4 secrets
        - __AWS_S3_BUCKET_NAME__: eg. `workshops-app-mfe`
        - __AWS_ACCESS_KEY_ID__: The one stored in the .env.prod file
        - __AWS_SECRET_ACCESS_KEY__: The one stored in the .env.prod file
        - __AWS_DISTRIBUTION_ID__: eg. E25V22QT6CGA5
- Re-run the build (GitHub actions -> re-run failing job). Or make a small change like updating the package.json version numbers, commit and push the changes.
- Check CloudFront URL - eg. https://d264yehg9r033b.cloudfront.net. You should see the app up and running
- In `webpack.prod.js` files setting up remotes, the production URL is needed
    - Set the CloudFront distributin domain as a secret in GitHub
    - `PRODUCTION_DOMAIN`: https://d264yehg9r033b.cloudfront.net
- eg. https://d381c2ilh1p47i.cloudfront.net
- Add, commit and push

## Step 27: Single SPA framework for building MFEs
Single SPA is a microfrontend framework for building MFEs, especially ones with different UI frameworks (one is built using Angular, another using React etc.)

### Single SPA Resources
__NOTES__:
- There is no Getting started guide or tutorial for the latest version 6.x. Instead paid video courses are available. You can check them out if you have resources to purchase the course
- The single-spa project does not seems to have received updates in a long time (check the [GitHub project repo](https://github.com/single-spa/single-spa)). Even the sample projects use quite old versions of react, Angular etc. Be mindful of this when considering to use the framework.
- About single-spa: https://single-spa.js.org/docs/getting-started-overview/
- Using latest React and ReactDOM: https://single-spa.js.org/docs/ecosystem-react.html
- More examples for further exploration: https://single-spa.js.org/docs/examples
    - You may explore this example provided for React MFEs - https://github.com/react-microfrontends/people

- This is one good application that is clear and concise. You can understand this to get started with single-spa with different frameworks (it uses React, Angular, Svelte, and vanilla JS). However it is built with single-spa 5.x and older versions of the UI frameworks as well (react, Angular etc.).
__Video tutorial by Jack Herrington__: Uses single-spa v5 (All but one feature (app) is built, the video builds one missing feature)
- GitHub repository: https://github.com/jherr/wp5-and-single-spa/tree/master
- Video tutorial on adding the feature: https://www.youtube.com/watch?v=wxnwPLLIJCY
