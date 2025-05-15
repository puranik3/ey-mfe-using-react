// import './Home.scss';
// import { useSelector } from 'react-redux';

// import { selectTheme } from 'shared/features/themeSlice';
import { useState, useEffect } from 'react';
import { subscribeThemeChanged, getContrastTheme } from 'shared/events'


import styles from './Home2.module.scss';

const Home = () => {
    // const { value, contrastValue } = useSelector(selectTheme);
    const [theme, setTheme] = useState('light');

    const contrastTheme = getContrastTheme(theme);

    useEffect(
        () => {
            const unsubscribe = subscribeThemeChanged(setTheme);

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