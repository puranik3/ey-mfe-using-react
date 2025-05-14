import axios from 'axios';

const baseUrl = `https://workshops-server.onrender.com`;

const getWorkshops = async (page = 1, category = '') => {
    const params = {
        _page: page,
    };

    if (category !== '') {
        params.category = category;
    }

    const response = await axios.get(
        `${baseUrl}/workshops`,
        {
            params,
        }
    );

    return response.data;
};

const getWorkshopById = async (id) => {
    const response = await axios.get(`${baseUrl}/workshops/${id}`);

    return response.data;
};

export {
    getWorkshops,
    getWorkshopById
}