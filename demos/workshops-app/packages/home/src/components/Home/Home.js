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