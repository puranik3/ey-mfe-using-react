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