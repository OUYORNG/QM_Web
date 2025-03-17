import axios from "axios";

const API_URL = "http://localhost:8003";

export const register = async (username: string, password: string) => {
    const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    return res.json();
};

export const login = async (username: string, password: string) => {
    try {
        const res = await axios.post(`${API_URL}/api/login`, {
            email: username,
            password: password,
        }, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        });

        const data = res.data;
        console.log(data);

        if (data.token) {
            localStorage.setItem("token", data.token);
        }
        return data;
    } catch (error:any) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            alert('Invalid Credential')
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Request data:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error message:', error.message);
        }
        throw error;
    }
};

export const getProtectedData = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/protected`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
};