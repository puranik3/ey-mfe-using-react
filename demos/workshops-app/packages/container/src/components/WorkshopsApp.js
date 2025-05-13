import { mount } from 'workshops/WorkshopsApp';
import { useEffect, useRef } from 'react';

const WorkshopsApp = () => {
    const ref = useRef();

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

export default WorkshopsApp;