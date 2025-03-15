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
    const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: username,
            password: password,
        }),
    });
    const data = await res.json();
    console.log(data);
    
    if (data.token) {
        localStorage.setItem("token", data.token);
    }
    return data;
};

export const getProtectedData = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/protected`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
};
