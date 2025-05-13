// sfc
import { useEffect, useState } from 'react';
import { Alert, Col, Row, Spinner } from "react-bootstrap";

import { ErrorAlert, LoadingSpinner } from 'shared/components';

import Item from './Item/Item';

import { getWorkshops } from '../../../services/workshops';

const WorkshopsList = () => {
    const [loading, setLoading] = useState(true);
    const [workshops, setWorkshops] = useState([]);
    const [error, setError] = useState(null);

    useEffect(
        () => {
            setLoading(true);

            const helper = async () => {
                try {
                    const workshops = await getWorkshops();
                    setWorkshops(workshops);
                } catch (error) {
                    setError(error);
                } finally {
                    setLoading(false);
                }
            };

            helper();
        },
        []
    );

    return (
        <div>
            <h1>List of workshops</h1>
            <hr />

            {loading === true && (
                <LoadingSpinner />
            )}

            {error !== null && loading === false && (
                <ErrorAlert error={error} />
            )}

            {
                error === null && loading === false && (
                    <Row xs={1} md={3} lg={4}>
                        {
                            workshops.map((w) => (
                                <Col
                                    className="my-3 d-flex"
                                    key={w.id}
                                >
                                    <Item {...w} />
                                </Col>
                            ))
                        }
                    </Row>
                )
            }
        </div>
    );
};

export default WorkshopsList;