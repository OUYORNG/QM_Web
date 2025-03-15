'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../api/auth";
import { Button } from "@heroui/button";
export default function page() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await login(username, password);
            if (res.token) {
                alert("Login successful!");
                router.push("/dashboard");
            } else {
                alert(res.message);
            }
        } catch (error) {
            // alert("Login failed");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <Button type="submit">Login</Button>
            </form>
        </div>
    );
}
