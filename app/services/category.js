import axios from 'axios';

export const fetchCategory = async () => {
    const url = process.env.NEXT_PUBLIC_FINACE_URL;
    const headers = {
        'Content-Type': 'application/json',
        'authToken': localStorage.getItem("authToken")
    };

    const response = await axios.get(`${url}/api/category/fetch`, {
        headers: headers
    });

    if (response.status === 200) {
        return response.data.data;
    } else {
        console.log("error", error.status);
        throw new Error("Failed to fetch categories", error.status);
    }
};
