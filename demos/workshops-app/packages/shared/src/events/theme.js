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