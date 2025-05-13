import { mount } from 'workshops/WorkshopsApp';
import { useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default () => {
    const ref = useRef(null);
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const onParentNavigateRef = useRef();

    useEffect(
        () => {
            const mountResult = mount(
                ref.current,
                {
                    initialPath: window.location.pathname,
                    onNavigate({ pathname, nextPathname, search }) {
                        console.log('container::WorkshopsApp::onNavigate', pathname, nextPathname, search);

                        if (pathname !== nextPathname || search !== '') {
                            navigate({
                                pathname: nextPathname,
                                search
                            });
                        }
                    }
                }
            );

            onParentNavigateRef.current = mountResult.onParentNavigate;

            const unmount = mountResult.unmount;

            // any clean up on unmounting workshops app can be done in the returned cleanup function
            return () => {
                console.log('container::WorkshopsApp::useEffect unmounting');
                unmount();
            };
        },
        []
    );

    useEffect(
        () => {
            console.log('container::WorkshopsApp::useEffect pathname', pathname);

            if (onParentNavigateRef && typeof onParentNavigateRef.current === 'function') {
                console.log('container::WorkshopsApp::useEffect Calling onParentNavigate', pathname);

                onParentNavigateRef.current({
                    nextPathname: pathname,
                });
            }
        },
        [pathname]
    );

    return <div ref={ref} />;
};