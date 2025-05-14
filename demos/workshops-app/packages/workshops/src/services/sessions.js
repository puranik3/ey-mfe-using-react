import axios from "axios";

const baseUrl = `https://workshops-server.onrender.com`;

const getSessionsForWorkshop = async (workshopId) => {
    const response = await axios.get(
        `${baseUrl}/workshops/${workshopId}/sessions`
    );

    return response.data;
};

const voteForSession = async (sessionId, voteType) => {
    // we generally pass data in PUT request. In this case we don't have any data.
    const response = await axios.put(
        `https://workshops-server.onrender.com/sessions/${sessionId}/${voteType}`
    );

    return response.data;
};

const postSession = async (session) => {
    const response = await axios.post(
        `https://workshops-server.onrender.com/sessions`,
        session,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    return response.data;
};

export { getSessionsForWorkshop, voteForSession, postSession };