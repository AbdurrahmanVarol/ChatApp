"use client";
import { useEffect, useState } from "react";
import { getApiWithToken } from "../api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

function timeAgo(dateString) {
    if (!dateString) return "";
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return `${diff} sn önce`;
    if (diff < 3600) return `${Math.floor(diff / 60)} dk önce`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} sa önce`;
    return `${Math.floor(diff / 86400)} gün önce`;
}

function Sidebar({ user, onProfile, onSettings }) {
    return (
        <div className="w-20 bg-[#111b21] flex flex-col items-center py-4 border-r border-[#222d34]">
            <button onClick={onProfile} className="mb-4 focus:outline-none">
                {user?.profilePictureBase64 ? (
                    <img src={`data:image/png;base64,${user.profilePictureBase64}`} alt="profile" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-xl font-bold text-white">
                        {user?.firstName?.[0] || "?"}
                    </div>
                )}
            </button>
            <button onClick={onSettings} className="mt-2 p-2 rounded-full hover:bg-[#222d34] focus:outline-none">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>
            </button>
        </div>
    );
}

function ProfileScreen({ user, onBack }) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-white bg-[#222d34]">
            <button onClick={onBack} className="absolute top-4 left-24 text-gray-400 hover:text-white">Geri</button>
            <div className="flex flex-col items-center">
                {user?.profilePictureBase64 ? (
                    <img src={`data:image/png;base64,${user.profilePictureBase64}`} alt="profile" className="w-32 h-32 rounded-full object-cover mb-4" />
                ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-500 flex items-center justify-center text-4xl font-bold mb-4">
                        {user?.firstName?.[0] || "?"}
                    </div>
                )}
                <div className="text-2xl font-bold mb-2">{user?.firstName} {user?.lastName}</div>
                <div className="mb-2 text-gray-400">{user?.userName}</div>
                <div className="mb-2">{user?.bio}</div>
                <div className="mb-2 text-gray-400">{user?.email}</div>
                <div className="mb-2 text-gray-400">Cinsiyet: {user?.gender}</div>
            </div>
        </div>
    );
}

function SettingsScreen({ onBack, onEditProfile, onLogout }) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-white bg-[#222d34]">
            <button onClick={onBack} className="absolute top-4 left-24 text-gray-400 hover:text-white">Geri</button>
            <div className="text-2xl font-bold mb-4">Ayarlar</div>
            <div className="flex flex-col gap-4 w-64">
                <button onClick={onEditProfile} className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">Profil Düzenle</button>
                <button onClick={onLogout} className="bg-red-600 hover:bg-red-700 text-white py-2 rounded">Çıkış Yap</button>
            </div>
        </div>
    );
}

function ChatScreen({ user, onBack }) {
    return (
        <div className="flex-1 flex flex-col h-full bg-[#222d34]">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-[#222d34]">
                <button onClick={onBack} className="mr-2 text-gray-400 hover:text-white">←</button>
                {user.profilePictureBase64 ? (
                    <img src={`data:image/png;base64,${user.profilePictureBase64}`} alt="profile" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-lg font-bold">
                        {user.firstName[0]}{user.lastName[0]}
                    </div>
                )}
                <div>
                    <div className="font-bold">{user.firstName} {user.lastName}</div>
                    <div className="text-xs text-gray-400">{user.userName}</div>
                </div>
            </div>
            <div className="flex-1 flex flex-col justify-end p-6 overflow-y-auto">
                {/* Mesajlar burada olacak, şimdilik boş */}
            </div>
            <form className="flex items-center p-4 border-t border-[#222d34] bg-[#222d34]">
                <input type="text" className="flex-1 bg-[#2a3942] text-white px-4 py-2 rounded-l-full outline-none" placeholder="Bir mesaj yazın" />
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-r-full">Gönder</button>
            </form>
        </div>
    );
}

export default function HomePage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [screen, setScreen] = useState("main"); // main, profile, settings
    const [selectedUser, setSelectedUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const api = getApiWithToken();
        api.get("/users").then(res => setUsers(res.data)).finally(() => setLoading(false));
        api.get("/users/info").then(res => setProfile(res.data));
    }, []);

    const handleLogout = () => {
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        router.push("/login");
    };

    return (
        <div className="flex h-screen bg-[#111b21]">
            <Sidebar user={profile} onProfile={() => { setScreen("profile"); setSelectedUser(null); }} onSettings={() => { setScreen("settings"); setSelectedUser(null); }} />
            {screen === "profile" ? (
                <ProfileScreen user={profile} onBack={() => setScreen("main")} />
            ) : screen === "settings" ? (
                <SettingsScreen onBack={() => setScreen("main")} onEditProfile={() => setScreen("profile")} onLogout={handleLogout} />
            ) : (
                <>
                    <aside className="w-96 bg-[#202c33] text-white flex flex-col border-r border-[#222d34]">
                        <div className="p-4 text-xl font-bold border-b border-[#222d34]">Kullanıcılar</div>
                        <div className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="p-4">Yükleniyor...</div>
                            ) : (
                                users.map((user, idx) => (
                                    <div key={idx} className={`flex items-center gap-3 px-4 py-3 hover:bg-[#2a3942] cursor-pointer border-b border-[#222d34] ${selectedUser?.userName === user.userName ? "bg-[#2a3942]" : ""}`}
                                        onClick={() => setSelectedUser(user)}>
                                        {user.profilePictureBase64 ? (
                                            <img src={`data:image/png;base64,${user.profilePictureBase64}`} alt="profile" className="w-12 h-12 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-xl font-bold">
                                                {user.firstName[0]}{user.lastName[0]}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold truncate">
                                                {user.lastMessage ? user.lastMessage : user.userName}
                                            </div>
                                            <div className="text-xs text-gray-400 truncate">
                                                {user.lastMessage ? timeAgo(user.lastMessageDate) : user.email}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </aside>
                    {selectedUser ? (
                        <ChatScreen user={selectedUser} onBack={() => setSelectedUser(null)} />
                    ) : (
                        <main className="flex-1 flex items-center justify-center text-white bg-[#222d34]">
                            <div className="text-2xl opacity-60">Bir kullanıcı seçin veya yeni sohbet başlatın.</div>
                        </main>
                    )}
                </>
            )}
        </div>
    );
}
