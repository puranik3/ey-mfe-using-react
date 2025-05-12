// the 'home' here is the LHS in remote: { } portion of webpack module federation configuration
import { mount } from 'home/HomeApp';
import { useEffect, useRef } from 'react';

const HomeApp = () => {
    const ref = useRef(); // ref.current -> div we creatd below

    // do this as soon as HomeApp component mount and the div is in the DOM
    useEffect(
        () => {
            if (ref.current) {
                mount(ref.current);
            }
        },
        []
    );

    return (
        <div ref={ref}></div>
    );
};

export default HomeApp;