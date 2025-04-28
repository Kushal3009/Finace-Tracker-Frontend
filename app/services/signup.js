import axios from "axios"; // use ES6 import if you're using `export`

const handleSignup = async (params) => {
    try {
        const { username, email, password, currency } = params;

        if (!email || !password) {
            throw new Error("All fields are required");
        }

        const apiUrl = `${process.env.NEXT_PUBLIC_AUTH_URL}/api/auth/signup`; // Make sure this is actually the login URL

        const response = await axios.post(apiUrl, { username, email, password, currency }, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log(response)
        if (response.data.status !== 'success') {
            throw new Error("Sign Up failed");
        }

        return response.data;
    } catch (error) {
        console.error("Error during Sign Up:", error.message);
        throw new Error(error.response?.data?.message || error.message || "An error occurred during login");
    }
};

export { handleSignup };
