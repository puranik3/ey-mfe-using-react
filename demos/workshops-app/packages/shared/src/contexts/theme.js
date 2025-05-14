import { createContext, useContext, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light'); // or load from localStorage

    const contrastTheme = theme === 'light' ? 'dark' : 'light';

    const toggleTheme = () => {
        setTheme(
            (prevTheme) => (prevTheme === 'light' ? 'dark' : 'light')
        );
    };

    return (
        <ThemeContext.Provider value={{ theme, contrastTheme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);