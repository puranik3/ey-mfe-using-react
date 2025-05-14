import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Col, Image, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle } from "@fortawesome/free-regular-svg-icons";

import { ErrorAlert, FormattedDate, LoadingSpinner } from "shared/components";

import { getWorkshopById } from '../../../services/workshops';

import "./WorkshopDetails.scss";

const WorkshopDetails = () => {
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [workshop, setWorkshop] = useState(null);
    const [error, setError] = useState(null);

    useEffect(
        () => {
            const helper = async () => {
                setLoading(true);

                try {
                    const workshop = await getWorkshopById(id);

                    setLoading(false);
                    setWorkshop(workshop);
                } catch (error) {
                    setLoading(false);
                    setError(error);
                }
            };

            helper();
        },
        [id]
    );

    return (
        <div>
            {loading && (
                <LoadingSpinner />
            )}

            {!loading && error && (
                <ErrorAlert error={error} />
            )}

            {!loading && !error && workshop && (
                <>
                    <h1>{workshop.name}</h1>
                    <hr />
                    <Row>
                        <Col xs={12} md={4}>
                            <Image
                                src={workshop.imageUrl}
                                alt={workshop.name}
                                fluid
                            />
                        </Col>
                        <Col xs={12} md={8}>
                            <div className="mb-3">
                                <div>{workshop.time}</div>
                                <div>
                                    <FormattedDate date={workshop.startDate} />
                                    <span> - </span>
                                    <FormattedDate date={workshop.endDate} />
                                </div>
                                <div>
                                    {workshop.location.address},
                                    {workshop.location.city},
                                    {workshop.location.state}
                                </div>
                                <div>
                                    <span className="me-4">
                                        <FontAwesomeIcon icon={workshop.modes.inPerson ? faCheckCircle : faTimesCircle} className="me-1" />
                                        In person
                                    </span>
                                    <span>
                                        <FontAwesomeIcon icon={workshop.modes.online ? faCheckCircle : faTimesCircle} className="me-1" />
                                        Online
                                    </span>
                                </div>
                            </div>
                            <div dangerouslySetInnerHTML={{ __html: workshop.description }}></div>
                        </Col>
                    </Row>
                </>
            )}

            <div className="mt-5">
                <NavLink
                    to={"/workshops/" + id}
                    end
                    className={
                        ({ isActive }) => "btn btn-primary btn-sm btn-child-link me-2 " + (isActive ? "btn-active" : "")
                    }
                >
                    Sessions List
                </NavLink>
                <NavLink
                    to={"/workshops/" + id + "/add"}
                    className={
                        ({ isActive }) => "btn btn-primary btn-sm btn-child-link" + (isActive ? "btn-active" : "")
                    }
                >
                    Add a session
                </NavLink>
            </div>

            <div className="my-4">
                <Outlet />
            </div>
        </div>
    );
};

export default WorkshopDetails;