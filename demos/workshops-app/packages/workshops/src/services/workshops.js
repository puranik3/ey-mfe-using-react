import axios from 'axios';

const baseUrl = `https://workshops-server.onrender.com`;

const getWorkshops = async () => {
    const response = await axios.get(`${baseUrl}/workshops`);

    return response.data;
}

const getWorkshopById = async (id) => {
    const response = await axios.get(`${baseUrl}/workshops/${id}`);

    return response.data;
};

export {
    getWorkshops,
    getWorkshopById
}