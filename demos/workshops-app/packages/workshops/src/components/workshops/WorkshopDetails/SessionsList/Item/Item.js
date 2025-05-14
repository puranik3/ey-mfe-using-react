import { memo } from 'react';
import { Col, Row } from "react-bootstrap";
import { VotingWidget } from 'shared/components';

const Item = memo(
    ({ session, vote }) => {
        const { id, name, speaker, level, abstract, duration, upvoteCount } = session;

        return (
            <Row>
                <Col
                    xs={1}
                    className="d-flex flex-column justify-content-center align-items-center"
                >
                    <VotingWidget
                        votes={upvoteCount}
                        vote={vote}
                    />
                </Col>
                <Col xs={11}>
                    <h3>{name}</h3>
                    <div>by {speaker}</div>
                    <div>{level}</div>
                    <div>Duration: {duration}</div>
                    <div>{abstract}</div>
                </Col>
            </Row>
        )
    }
);

export default Item;