import axios from "axios";
import toast from "react-hot-toast";


export const fetchEditAccess = async () => {
    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_FINACE_URL}/api/dashboard/salary/edit-permission`;
        const response = await axios.get(apiUrl, {
            headers: {
                'Content-Type': 'application/json',
                'authToken': localStorage.getItem('authToken')
            },
        })
        if (response.data.status !== 'success') {
            throw new Error('Failed to fetch edit access');
        }
        return response.data.data;
    } catch (error) {
        console.error('Error fetching edit access:', error.message);
        toast.error("error", error.message)
        throw new Error(error.response?.data?.message || error.message || 'An error occurred while fetching edit access');
    }
}


export const addSalary = async (params) => {
    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_FINACE_URL}/api/dashboard/salary/add`;
        const body = {
            salary: params.salary
        };


        const response = await axios.post(apiUrl, body, {
            headers: {
                'Content-Type': 'application/json',
                'authToken': localStorage.getItem('authToken')
            }
        });

        if (response.data.status !== 'success') {
            throw new Error('Failed to add salary');
        }

        return response.data.data;
    } catch (error) {
        console.error('Error adding salary:', error.message);
        toast.error(error.response?.data?.message || error.message || 'An error occurred while adding salary');
        throw new Error(error.response?.data?.message || error.message);
    }
};


export const updateSalary = async (params) => {
    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_FINACE_URL}/api/dashboard/salary/edit`;
        const body = {
            salary: params.salary
        };


        const response = await axios.post(apiUrl, body, {
            headers: {
                'Content-Type': 'application/json',
                'authToken': localStorage.getItem('authToken')
            }
        });

        if (response.data.status !== 'success') {
            throw new Error('Failed to Edit salary');
        }

        return response.data.data;
    } catch (error) {
        console.error('Error Edit salary:', error.message);
        toast.error(error.response?.data?.message || error.message || 'An error occurred while adding salary');
        throw new Error(error.response?.data?.message || error.message);
    }
};


export const fetchSalary = async () => {
    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_FINACE_URL}/api/dashboard/salary/get`;
        const response = await axios.get(apiUrl, {
            headers: {
                'Content-Type': 'application/json',
                'authToken': localStorage.getItem('authToken')
            },
        })
        if (response.data.status !== 'success') {
            throw new Error('Failed to fetch salary');
        }
        // console.log("response", response.data.data)
        return response.data.data;
    } catch (error) {
        console.error('Error fetching salary:', error.message);
        toast.error(error.response?.data?.message || error.message || 'An error occurred while fetching salary');
        throw new Error(error.response?.data?.message || error.message || 'An error occurred while fetching salary');
    }
}
