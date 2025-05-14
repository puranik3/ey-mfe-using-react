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