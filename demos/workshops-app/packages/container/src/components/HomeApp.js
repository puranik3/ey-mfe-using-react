// the 'home' here is the LHS in remote: { } portion of webpack module federation configuration
import { mount } from 'home/HomeApp';
import { useEffect, useRef } from 'react';

const HomeApp = () => {
    const ref = useRef(); // ref.current -> div we creatd below

    // do this as soon as HomeApp component mount and the div is in the DOM
    useEffect(
        () => {
            let unmount;

            if (ref.current) {
                const result = mount(ref.current);
                unmount = result.unmount;
            }

            // cleanup function is returned from the effect - therefore unmount function it will be called when HomApp unmounts
            return unmount;
        },
        []
    );

    return (
        <div ref={ref}></div>
    );
};

export default HomeApp;