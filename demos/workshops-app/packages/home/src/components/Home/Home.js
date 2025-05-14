// import './Home.scss';
import { useTheme } from 'shared/contexts';

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