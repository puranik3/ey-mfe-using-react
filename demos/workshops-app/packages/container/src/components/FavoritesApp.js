import { mount } from 'favorites/FavoritesApp';
import { useEffect, useRef } from 'react';

const FavoritesApp = () => {
    const ref = useRef();

    useEffect(
        () => {
            let unmount;

            if (ref.current) {
                const result = mount(ref.current);
                unmount = result.unmount;
            }

            return unmount;
        },
        []
    );

    return (
        <div ref={ref}></div>
    );
};

export default FavoritesApp;