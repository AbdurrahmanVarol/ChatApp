"use client";
import { useState } from "react";
import api from "../api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const response = await api.post("/auth/login", {
                userName,
                password,
            });
            const { token, refreshToken, name, expire } = response.data;
            Cookies.set("token", token, { expires: new Date(expire) });
            Cookies.set("name", name, { expires: new Date(expire) });
            Cookies.set("refreshToken", refreshToken, { expires: new Date(expire) });
            setSuccess("Login successful!");
            router.push("/home");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-[#111b21]">
            <aside className="w-1/3 min-w-[320px] bg-[#202c33] flex flex-col items-center justify-center border-r border-[#222d34]">
                <div className="text-4xl font-bold text-white mb-4">ChatApp</div>
                <div className="text-gray-400 mb-8">Giriş yap ve sohbete başla</div>
            </aside>
            <main className="flex-1 flex items-center justify-center bg-[#222d34]">
                <div className="w-full max-w-md p-8 rounded-lg shadow bg-[#202c33]">
                    <h2 className="text-2xl font-bold mb-6 text-white">Giriş Yap</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block mb-1 text-gray-300">Kullanıcı Adı</label>
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full border border-[#2a3942] bg-[#111b21] text-white px-3 py-2 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-gray-300">Şifre</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-[#2a3942] bg-[#111b21] text-white px-3 py-2 rounded"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                            disabled={loading}
                        >
                            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                        </button>
                        {error && <div className="text-red-600 mt-2">{error}</div>}
                        {success && <div className="text-green-600 mt-2">{success}</div>}
                    </form>
                </div>
            </main>
        </div>
    );
}
