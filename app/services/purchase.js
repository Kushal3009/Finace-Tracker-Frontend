import axios from "axios";

export const handlePurchase = async (params) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_FINACE_URL}/api/purchase/add`;
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        window.location.href = '/login';
        return;
    }
    const headers = {
        'Content-Type': 'application/json',
        'authToken': authToken
    };

    console.log("==================>", params);

    try {
        const response = await axios.post(apiUrl, params, { headers });
        if (response.data.status !== 'success') {
            throw new Error('Failed to add purchase');
        }
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            window.location.href = '/login';
            return;
        }
        throw error;
    }
};


export const fetchPurchase = async (query) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_FINACE_URL}/api/purchase/get`;
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        window.location.href = '/login';
        return;
    }
    const headers = {
        'Content-Type': 'application/json',
        'authToken': authToken
    };

    try {
        const response = await axios.get(apiUrl, {
            headers,
            params: query
        });
        if (response.data.status !== 'success') {
            throw new Error('Failed to fetch purchases');
        }
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            window.location.href = '/login';
            return;
        }
        throw error;
    }
};

export const deletePurchase = async (id) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_FINACE_URL}/api/purchase/delete?purchaseId=${id}`;
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        window.location.href = '/login';
        return;
    }
    const headers = {
        'Content-Type': 'application/json',
        'authToken': authToken
    };
    try {
        const response = await axios.delete(apiUrl, { headers });
        if (response.data.status !== 'success') {
            throw new Error('Failed to delete purchase');
        }
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            window.location.href = '/login';
            return;
        }
        throw error;
    }
};

export const updatePurchase = async (id, params) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_FINACE_URL}/api/purchase/edit?purchaseId=${id}`;
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        window.location.href = '/login';
        return;
    }
    const headers = {
        'Content-Type': 'application/json',
        'authToken': authToken
    };
    try {
        console.log("params", params);
        console.log("id", id);
        const response = await axios.put(apiUrl, params, { headers });

        if (response.data.status !== 'success') {
            throw new Error('Failed to update purchase');
        }
        return response.data;
    } catch (error) {
        console.log("error", error);
        if (error.response && error.response.status === 401) {
            window.location.href = '/login';
            return;
        }
        throw error;
    }
};
