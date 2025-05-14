import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, ListGroup, Row } from "react-bootstrap";
// import { toast } from "react-toastify";

import { ErrorAlert, LoadingSpinner } from 'shared/components';
import Item from "./Item/Item";

import { getSessionsForWorkshop, voteForSession } from "../../../../services/sessions";

const SessionsList = () => {
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState([]);
    const [error, setError] = useState(null);

    useEffect(
        () => {
            const helper = async () => {
                setLoading(true);

                try {
                    const sessions = await getSessionsForWorkshop(id);

                    setLoading(false);
                    setSessions(sessions);
                } catch (error) {
                    setLoading(false);
                    setError(error);
                }
            };

            helper();
        },
        [id]
    );

    const vote = useCallback(
        async (
            sessionId,
            voteType
        ) => {
            try {
                const updatedSession = await voteForSession(sessionId, voteType);
                setSessions(
                    sessions => sessions.map(s => s.id === sessionId ? updatedSession : s)
                );
                // toast('You vote for session ' + updatedSession.name + ' has been captured');
                alert('You vote for session ' + updatedSession.name + ' has been captured');
            } catch (error) {
                // toast(error.message);
                alert(error.message);
            }
        },
        [voteForSession, setSessions/*, toast */]
    );

    return (
        <div>
            <h2>List of Sessions</h2>

            <hr />

            {loading && (
                <LoadingSpinner />
            )}

            {!loading && error && (
                <ErrorAlert error={error} />
            )}

            {!loading && !error && (
                <ListGroup>
                    {sessions.map((s, idx) => (
                        <ListGroup.Item key={s.id}>
                            <Item
                                session={s}
                                vote={(voteType) => vote(s.id, voteType)}
                            />
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </div>
    );
};

export default SessionsList;