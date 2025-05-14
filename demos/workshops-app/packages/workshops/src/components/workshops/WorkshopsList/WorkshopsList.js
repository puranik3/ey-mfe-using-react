import { useEffect, useState } from 'react';
import { Col, Row } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";

import { ErrorAlert, LoadingSpinner, Pagination } from 'shared/components';

import Item from './Item/Item';

import { getWorkshops } from '../../../services/workshops';

const WorkshopsList = () => {
    const [loading, setLoading] = useState(true);
    const [workshops, setWorkshops] = useState([]);
    const [error, setError] = useState(null);

    // ?page=2&category=frontend
    const [searchParams, setSearchParams] = useSearchParams();

    // Default to page 1
    const page = +(searchParams.get("page") || "1");
    // Default to no category (empty string)
    const category = searchParams.get("category") || "";

    const previous = (by) => {
        if (page <= 1) {
            return;
        }

        // ?page=2&category=frontend -> // ?page=1&category=frontend
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', '' + (page - by));
        setSearchParams(newParams);
    };

    const next = (by) => {
        // ?page=1 -> ?page=2
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', '' + (page + by));
        setSearchParams(newParams);
    };

    const setCategory = (category) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('category', category);
        setSearchParams(newParams);
    };

    useEffect(
        () => {
            setLoading(true);

            const helper = async () => {
                try {
                    const workshops = await getWorkshops(page, category);
                    setWorkshops(workshops);
                } catch (error) {
                    setError(error);
                } finally {
                    setLoading(false);
                }
            };

            helper();
        },
        [page, category]
    );

    return (
        <div>
            <h1>List of workshops</h1>
            <hr />

            <div className="my-4">
                <Pagination
                    page={page}
                    disablePrevious={loading}
                    disableNext={loading}
                    onPrevious={previous}
                    onNext={next}
                />
            </div>

            <div>
                <div className="btn-group my-3" role="group" aria-label="Filter by category">
                    <button type="button" className="btn btn-primary" onClick={() => setCategory('')}>All</button>
                    <button type="button" className="btn btn-danger" onClick={() => setCategory('frontend')}>Frontend</button>
                    <button type="button" className="btn btn-warning" onClick={() => setCategory('backend')}>Backend</button>
                    <button type="button" className="btn btn-success" onClick={() => setCategory('devops')}>Devops</button>
                    <button type="button" className="btn btn-info" onClick={() => setCategory('language')}>Language</button>
                    <button type="button" className="btn btn-light" onClick={() => setCategory('mobile')}>Mobile</button>
                    <button type="button" className="btn btn-dark" onClick={() => setCategory('database')}>Database</button>
                </div>
            </div>

            {loading === true && (
                <LoadingSpinner />
            )}

            {error !== null && loading === false && (
                <ErrorAlert err={error} />
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