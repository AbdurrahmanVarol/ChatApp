"use client";
import { useState, useEffect } from "react";
import api from "../api";

export default function RegisterPage() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        bio: "",
        profilePictureUrl: "",
        email: "",
        userName: "",
        password: "",
        passwordConfirm: "",
        genderId: "",
    });
    const [genders, setGenders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [step, setStep] = useState(1);

    useEffect(() => {
        if (step === 2) {
            api.get("/genders")
                .then(res => setGenders(res.data))
                .catch(() => setGenders([]));
        }
    }, [step]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validateStep1 = () => {
        if (!form.firstName || !form.lastName || !form.email || !form.userName || !form.password || !form.passwordConfirm) return false;
        if (form.password !== form.passwordConfirm) return false;
        return true;
    };

    const handleNext = (e) => {
        e.preventDefault();
        setError("");
        if (!validateStep1()) {
            setError("Lütfen tüm alanları doldurun ve şifreler eşleşsin.");
            return;
        }
        setStep(2);
    };

    const handleBack = (e) => {
        e.preventDefault();
        setError("");
        setStep(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            await api.post("/auth/register", {
                ...form,
                genderId: parseInt(form.genderId, 10),
            });
            setSuccess("Kayıt başarılı!");
        } catch (err) {
            setError(err.response?.data?.message || "Kayıt başarısız");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-[#111b21]">
            <aside className="w-1/3 min-w-[320px] bg-[#202c33] flex flex-col items-center justify-center border-r border-[#222d34]">
                <div className="text-4xl font-bold text-white mb-4">ChatApp</div>
                <div className="text-gray-400 mb-8">Hesap oluştur ve sohbete katıl</div>
            </aside>
            <main className="flex-1 flex items-center justify-center bg-[#222d34]">
                <div className="w-full max-w-md p-8 rounded-lg shadow bg-[#202c33]">
                    <h2 className="text-2xl font-bold mb-6 text-white">Kayıt Ol</h2>
                    <form onSubmit={step === 1 ? handleNext : handleSubmit} className="space-y-6">
                        {step === 1 && (
                            <>
                                <div>
                                    <label className="block mb-1 text-gray-300">Ad</label>
                                    <input name="firstName" value={form.firstName} onChange={handleChange} className="w-full border border-[#2a3942] bg-[#111b21] text-white px-3 py-2 rounded" required />
                                </div>
                                <div>
                                    <label className="block mb-1 text-gray-300">Soyad</label>
                                    <input name="lastName" value={form.lastName} onChange={handleChange} className="w-full border border-[#2a3942] bg-[#111b21] text-white px-3 py-2 rounded" required />
                                </div>
                                <div>
                                    <label className="block mb-1 text-gray-300">E-posta</label>
                                    <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border border-[#2a3942] bg-[#111b21] text-white px-3 py-2 rounded" required />
                                </div>
                                <div>
                                    <label className="block mb-1 text-gray-300">Kullanıcı Adı</label>
                                    <input name="userName" value={form.userName} onChange={handleChange} className="w-full border border-[#2a3942] bg-[#111b21] text-white px-3 py-2 rounded" required />
                                </div>
                                <div>
                                    <label className="block mb-1 text-gray-300">Şifre</label>
                                    <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full border border-[#2a3942] bg-[#111b21] text-white px-3 py-2 rounded" required />
                                </div>
                                <div>
                                    <label className="block mb-1 text-gray-300">Şifre Tekrar</label>
                                    <input type="password" name="passwordConfirm" value={form.passwordConfirm} onChange={handleChange} className="w-full border border-[#2a3942] bg-[#111b21] text-white px-3 py-2 rounded" required />
                                </div>
                                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                                    Sonraki
                                </button>
                            </>
                        )}
                        {step === 2 && (
                            <>
                                <div>
                                    <label className="block mb-1 text-gray-300">Biyografi</label>
                                    <textarea name="bio" value={form.bio} onChange={handleChange} className="w-full border border-[#2a3942] bg-[#111b21] text-white px-3 py-2 rounded" />
                                </div>
                                <div>
                                    <label className="block mb-1 text-gray-300">Cinsiyet</label>
                                    <select name="genderId" value={form.genderId} onChange={handleChange} className="w-full border border-[#2a3942] bg-[#111b21] text-white px-3 py-2 rounded" required>
                                        <option value="">Cinsiyet seçin</option>
                                        {genders.map(g => (
                                            <option key={g.id} value={g.id}>{g.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={handleBack} className="w-1/2 bg-gray-400 text-white py-2 rounded hover:bg-gray-500">Geri</button>
                                    <button type="submit" className="w-1/2 bg-green-600 text-white py-2 rounded hover:bg-green-700" disabled={loading}>
                                        {loading ? "Kayıt olunuyor..." : "Kayıt Ol"}
                                    </button>
                                </div>
                            </>
                        )}
                        {error && <div className="text-red-600 mt-2">{error}</div>}
                        {success && <div className="text-green-600 mt-2">{success}</div>}
                    </form>
                </div>
            </main>
        </div>
    );
}
