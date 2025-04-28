import axios from "axios"; // use ES6 import if you're using `export`

const handleLogin = async (params) => {
    try {
        const { email, password } = params;

        if (!email || !password) {
            toast.error("All fields are required")
            throw new Error("All fields are required");
        }

        const apiUrl = `${process.env.NEXT_PUBLIC_AUTH_URL}/api/auth/login`; // Make sure this is actually the login URL

        const response = await axios.post(apiUrl, { email, password }, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.data.status !== 'success') {
            throw new Error("Login failed");
        }

        return response.data;
    } catch (error) {
        console.error("Error during login:", error.message);
        throw new Error(error.response?.data?.message || error.message || "An error occurred during login");
    }
};

const fetchUserDetails = async () => {
    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_AUTH_URL}/api/auth/userDetails`;
        const response = await axios.get(apiUrl, {
            headers: {
                'Content-Type': 'application/json',
                'authToken': localStorage.getItem('authToken')
                // Add auth token if required, e.g.:
                // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
        });
        if (response.data.status !== 'success') {
            throw new Error('Failed to fetch user details');
        }
        return response.data.data;
    } catch (error) {
        console.error('Error fetching user details:', error.message);
        throw new Error(error.response?.data?.message || error.message || 'An error occurred while fetching user details');
    }
};


const updateUserDetails = async (params) => {
    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_AUTH_URL}/api/auth/modifyUser`;
        const response = await axios.post(
            apiUrl,
            params, // ✅ Just pass the body directly as the second argument
            {
                headers: {
                    'Content-Type': 'application/json',
                    'authToken': localStorage.getItem('authToken')
                    // Or use Authorization Bearer if required
                    // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            }
        );

        if (response.data.status !== 'success') {
            throw new Error('Failed to fetch user details');
        }
        console.log(response.data.data)
        return response.data.data;

    } catch (error) {
        console.error('Error updating user details:', error.message);
        throw error;
    }
};


export { handleLogin, fetchUserDetails, updateUserDetails };
