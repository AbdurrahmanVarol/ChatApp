"use client";
import { useEffect, useState, useRef } from "react";
import { getApiWithToken } from "../api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { HubConnectionBuilder } from "@microsoft/signalr";

function PlusIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
    );
}
function CheckIcon() {
    return (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
    );
}

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

function isUrl(text) {
    try {
        const url = new URL(text);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}
function extractUrls(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
}
function ChatDetailsScreen({ chatId, onBack, connection }) {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const api = getApiWithToken();
    useEffect(() => {
        if (!chatId) return;
        setLoading(true);
        api.get(`/chats/${chatId}/details`)
            .then(res => setDetails(res.data))
            .finally(() => setLoading(false));
    }, [chatId]);

    useEffect(() => {
        if (!connection || !chatId) return;

        const handleReceiveMessage = (receivedChatId, message, senderUserId, timestamp) => {
            if (receivedChatId === chatId) {
                console.log("ChatDetailsScreen: Yeni mesaj alındı, detaylar yenileniyor");
                
                api.get(`/chats/${chatId}/details`)
                    .then(res => setDetails(res.data))
                    .catch(err => console.error("Mesaj detayları yenilenemedi:", err));
            }
        };

        connection.on("ReceiveMessage", handleReceiveMessage);

        return () => {
            connection.off("ReceiveMessage", handleReceiveMessage);
        };
    }, [connection, chatId]);
    const messagesEndRef = useRef(null);
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [details]);
    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim()) {
            alert("Mesaj boş olamaz");
            return;
        }
        if (!connection) {
            alert("SignalR bağlantısı kurulmamış");
            return;
        }
        if (connection.state !== "Connected") {
            alert("SignalR bağlantısı aktif değil");
            return;
        }

        setSending(true);
        try {
            console.log("SignalR hub'ına mesaj gönderiliyor:", { chatId, message });

            
            await connection.invoke("SendMessage", chatId, message);
            console.log("Mesaj SignalR hub'ına başarıyla gönderildi");

            setMessage("");

            
            const res = await api.get(`/chats/${chatId}/details`);
            setDetails(res.data);
        } catch (err) {
            console.error("Mesaj gönderme hatası:", err);
            alert(`Mesaj gönderilemedi: ${err.message}`);
        } finally {
            setSending(false);
        }
    };
    if (loading) return <div className="flex-1 flex items-center justify-center text-white bg-[#222d34]">Yükleniyor...</div>;
    if (!details) return <div className="flex-1 flex items-center justify-center text-white bg-[#222d34]">Detay bulunamadı.</div>;
    
     const name = Cookies.get('name');
    const mainUser = details.isGroupChat ? null : details.participants.filter(u => u.fullName !== name)[0];
    return (
        <div className="flex-1 flex flex-col h-full bg-[#222d34] relative">
            <div className="flex flex-row items-center border-b border-[#222d34] bg-[#202c33] px-6 py-4">
                <button onClick={onBack} className="text-gray-400 hover:text-white flex-shrink-0 mr-4">←</button>
                <div className="flex flex-1 flex-col items-center">
                    {details.isGroupChat ? (
                        <div className="w-16 h-16 rounded-full bg-blue-700 flex items-center justify-center text-2xl font-bold text-white mb-2">{details.chatName[0]}</div>
                    ) : (
                        mainUser?.profilePictureBase64 ? (
                            <img src={`data:image/png;base64,${mainUser.profilePictureBase64}`} alt="profile" className="w-16 h-16 rounded-full object-cover mb-2" />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-gray-500 flex items-center justify-center text-2xl font-bold mb-2">{mainUser?.firstName?.[0] || "?"}</div>
                        )
                    )}
                    <div className="font-bold text-lg text-white text-center">{details.chatName}</div>
                    {details.isGroupChat && (
                        <div className="text-xs text-blue-300 text-center">Grup Sohbeti</div>
                    )}
                    {!details.isGroupChat && (
                        <div className="text-xs text-gray-400 text-center">{mainUser?.userName}</div>
                    )}
                </div>
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto bg-[url('/public/whatsapp-bg.png')] bg-cover">
                    <div className="flex flex-col gap-2 px-8 py-6 justify-end min-h-full">
                        {details.messages && details.messages.length > 0 ? details.messages.map((msg, i) => {
                           
                            let showDate = false;
                            if (i === 0 || (new Date(details.messages[i].createdAt).toDateString() !== new Date(details.messages[i - 1].createdAt).toDateString())) {
                                showDate = true;
                            }
                            return <>
                                {showDate && (
                                    <div className="flex justify-center my-2">
                                        <span className="bg-[#222d34] text-gray-400 text-xs px-3 py-1 rounded-full">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                    </div>
                                )}
                                <div key={msg.messageId} className={`flex ${msg.isOwnMessage ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[60%] px-4 py-2 rounded-2xl shadow ${msg.isOwnMessage ? "bg-green-600 text-white" : "bg-[#2a3942] text-gray-200"}`}>
                                        <div className="text-xs font-semibold mb-1">{msg.senderName}</div>
                                        <div>
                                            {extractUrls(msg.content).length > 0 ? (
                                                msg.content.split(/(https?:\/\/[^\s]+)/g).map((part, idx) =>
                                                    isUrl(part) ?
                                                        <a key={idx} href={part} target="_blank" rel="noopener noreferrer" className="text-green-300 underline break-all">{part}</a>
                                                        : <span key={idx}>{part}</span>
                                                )
                                            ) : msg.content}
                                        </div>
                                        <div className="text-[10px] text-gray-300 mt-1 text-right">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>
                                </div>
                            </>;
                        }) : <div className="text-gray-400 text-sm">Henüz mesaj yok.</div>}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
                <form onSubmit={handleSend} className="flex items-center gap-2 px-6 py-4 bg-[#202c33] border-t border-[#222d34] flex-shrink-0">
                    <input
                        type="text"
                        className="flex-1 bg-[#2a3942] text-white px-4 py-2 rounded-full outline-none"
                        placeholder="Bir mesaj yazın"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        disabled={sending}
                    />
                    <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full disabled:opacity-50" disabled={sending || !message.trim()}>
                        {sending ? "Gönderiliyor..." : "Gönder"}
                    </button>
                </form>
            </div>

           
        </div>
    );
}

export default function HomePage() {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [screen, setScreen] = useState("main"); // main, profile, settings
    const [selectedChat, setSelectedChat] = useState(null);
    const [showNewChatPanel, setShowNewChatPanel] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [isGroup, setIsGroup] = useState(false);
    const [creatingChat, setCreatingChat] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [connection, setConnection] = useState(null);
    const router = useRouter();
    const [selectedChatId, setSelectedChatId] = useState(null);


   
    useEffect(() => {
        const token = Cookies.get("token");
        console.log("Token kontrolü:", token ? "Token var" : "Token yok");

        if (!token) {
            console.log("Token bulunamadı, SignalR bağlantısı kurulamıyor");
            return;
        }

        console.log("SignalR bağlantısı kuruluyor...");

       
        const hubUrl = "https://localhost:7177/chathub";
        console.log("Hub URL:", hubUrl);

        const newConnection = new HubConnectionBuilder()
            .withUrl(hubUrl, {
                accessTokenFactory: () => {
                    console.log("Token gönderiliyor:", token.substring(0, 20) + "...");
                    return token;
                },
                skipNegotiation: false, 
                transport: 0 
            })
            .withAutomaticReconnect()
            .build();

        newConnection.start()
            .then(() => {
                console.log("✅ SignalR bağlantısı başarıyla kuruldu");
                console.log("Connection ID:", newConnection.connectionId);
                setConnection(newConnection);
            })
            .catch(err => {
                console.error("❌ SignalR bağlantı hatası:", err);
                console.error("Hata detayı:", err.message);
                console.error("Hata kodu:", err.code);
                console.error("Tam hata:", err);

               
                console.log("SignalR bağlantısı kurulamadı");
            });

       
        newConnection.onclose((error) => {
            console.log("SignalR bağlantısı kapandı:", error);
        });

        newConnection.onreconnecting((error) => {
            console.log("SignalR yeniden bağlanıyor:", error);
        });

        newConnection.onreconnected((connectionId) => {
            console.log("SignalR yeniden bağlandı:", connectionId);
        });

        return () => {
            console.log("SignalR bağlantısı kapatılıyor");
            newConnection.stop();
        };
    }, []);

    
    useEffect(() => {
        if (!connection || !chats.length) return;

        chats.forEach(chat => {
            connection.invoke("JoinChat", chat.chatId);
        });
    }, [connection, chats]);

    
    useEffect(() => {
        if (!connection) return;

        connection.on("ReceiveMessage", (chatId, message, senderUserId, timestamp) => {
            console.log("Yeni mesaj alındı:", { chatId, message, senderUserId, timestamp });

            setChats(prevChats =>
                prevChats.map(chat =>
                    chat.chatId === chatId
                        ? { ...chat, lastMessage: message, lastMessageTime: timestamp }
                        : chat
                )
            );

            if (selectedChatId === chatId) {
                console.log("Açık sohbet güncelleniyor:", chatId);
              
                setSelectedChatId(chatId);
            }
        });

        return () => {
            connection.off("ReceiveMessage");
        };
    }, [connection, selectedChatId]);

    useEffect(() => {
        const api = getApiWithToken();
        api.get("/chats").then(res => setChats(res.data)).finally(() => setLoading(false));
        api.get("/users/info").then(res => setProfile(res.data));
    }, []);

  
    useEffect(() => {
        if (!showNewChatPanel) return;
        const api = getApiWithToken();
        setUsersLoading(true);
        if (searchTerm.trim() === "") {
            
            api.get("/users")
                .then(res => setUsers(res.data))
                .finally(() => setUsersLoading(false));
        } else {
           
            api.get(`/users/filter?name=${encodeURIComponent(searchTerm)}`)
                .then(res => setUsers(res.data))
                .finally(() => setUsersLoading(false));
        }
    }, [searchTerm, showNewChatPanel]);

    
    useEffect(() => {
        if (selectedChat && selectedChat.chatId) {
            setSelectedChatId(selectedChat.chatId);
        }
    }, [selectedChat]);

    const handleUserSelect = (userId) => {
        if (!userId) return;
        if (isGroup) {
            setSelectedUserIds(prev => {
               
                if (prev.includes(userId)) {
                    return prev.filter(id => id !== userId);
                } else {
                    return [...prev, userId];
                }
            });
        } else {
            setSelectedUserIds([userId]);
            handleCreateChat([userId], false); 
        }
    };

    const handleCreateChat = async (userIds = selectedUserIds, group = isGroup) => {
        
        const filteredUserIds = (userIds || []).filter(id => !!id);
        if (!filteredUserIds.length) return;
        setCreatingChat(true);
        const api = getApiWithToken();
        try {
            const res = await api.post("/Chats", {
                name: group ? groupName || "Yeni Grup" : "",
                isGroup: group,
                userIds: filteredUserIds,
                CreatedBy: null
            });
            if (res.status === 201 && res.data?.id) {
              
                const chatId = res.data.id;
                setGroupName("");
                setLoading(true);
                api.get("/chats").then(r => {
                    setChats(r.data);
                    const newChat = r.data.find(c => c.chatId === chatId);
                    setSelectedChat(newChat || null);
                    setSelectedChatId(chatId); 
                }).finally(() => setLoading(false));
                setShowNewChatPanel(false);
                setSelectedUserIds([]);
                setIsGroup(false);
            }
        } catch (e) {
            console.log(e);
            let msg = "Sohbet oluşturulamadı";
            if (e.response && e.response.data && typeof e.response.data === "string") {
                msg += ": " + e.response.data;
            } else if (e.response && e.response.data && e.response.data.message) {
                msg += ": " + e.response.data.message;
            }
            alert(msg);
        } finally {
            setCreatingChat(false);
        }
    };

    const handleLogout = () => {
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        router.push("/login");
    };

    return (
        <div className="flex h-screen bg-[#111b21]">
            <Sidebar user={profile} onProfile={() => { setScreen("profile"); setSelectedChat(null); }} onSettings={() => { setScreen("settings"); setSelectedChat(null); }} />
            {screen === "profile" ? (
                <ProfileScreen user={profile} onBack={() => setScreen("main")} />
            ) : screen === "settings" ? (
                <SettingsScreen onBack={() => setScreen("main")} onEditProfile={() => setScreen("profile")} onLogout={handleLogout} />
            ) : (
                <>
                    <aside className="w-96 bg-[#202c33] text-white flex flex-col border-r border-[#222d34]">
                        <div className="flex items-center justify-between p-4 text-xl font-bold border-b border-[#222d34]">
                            <span>Sohbetler</span>
                            <button
                                className="ml-2 p-1 rounded hover:bg-[#2a3942]"
                                title="Yeni sohbet"
                                onClick={() => {
                                    setShowNewChatPanel(true);
                                    setSelectedUserIds([]);
                                    setIsGroup(false);
                                    setSearchTerm("");
                                    setGroupName("");
                                }}
                            >
                                <PlusIcon />
                            </button>
                        </div>
                        {showNewChatPanel ? (
                            <div className="flex-1 flex flex-col p-4 gap-3">
                                <div className="flex items-center mb-2">
                                    <button
                                        className="mr-2 p-1 rounded hover:bg-[#2a3942]"
                                        title="Geri"
                                        onClick={() => {
                                            setShowNewChatPanel(false);
                                            setSelectedUserIds([]);
                                            setIsGroup(false);
                                            setSearchTerm("");
                                            setGroupName("");
                                        }}
                                    >
                                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
                                    </button>
                                    <span className="text-lg font-semibold">Yeni Sohbet</span>
                                </div>
                                <input
                                    className="w-full px-3 py-2 rounded bg-[#2a3942] text-white outline-none"
                                    placeholder="Bir ad veya numara aratın"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    autoFocus
                                />
                                <label className="flex items-center gap-2 text-sm select-none">
                                    <input
                                        type="checkbox"
                                        checked={isGroup}
                                        onChange={e => {
                                            setIsGroup(e.target.checked);
                                            setSelectedUserIds([]);
                                            setGroupName("");
                                        }}
                                    />
                                    Yeni grup oluştur
                                </label>
                                {isGroup && (
                                    <input
                                        className="w-full px-3 py-2 rounded bg-[#2a3942] text-white outline-none"
                                        placeholder="Grup adı girin"
                                        value={groupName}
                                        onChange={e => setGroupName(e.target.value)}
                                    />
                                )}
                                <div className="flex-1 overflow-y-auto border rounded bg-[#222d34] mt-2 max-h-[400px]">
                                    {usersLoading ? (
                                        <div className="p-4">Yükleniyor...</div>
                                    ) : users.length === 0 ? (
                                        <div className="p-4 text-gray-400">Kullanıcı bulunamadı.</div>
                                    ) : (
                                        <ul>
                                            {users.map(user => (
                                                <li
                                                    key={user.id}
                                                    onClick={() => handleUserSelect(user.id)}
                                                    className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-[#2a3942] ${selectedUserIds.includes(user.id) ? "bg-[#374151]" : ""}`}
                                                >
                                                    {user.profilePictureBase64 ? (
                                                        <img src={`data:image/png;base64,${user.profilePictureBase64}`} alt="profile" className="w-8 h-8 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-sm font-bold">
                                                            {user.firstName?.[0] || "?"}
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-semibold truncate">{user.firstName} {user.lastName}</div>
                                                        <div className="text-xs text-gray-400 truncate">{user.userName}</div>
                                                    </div>
                                                    {isGroup && selectedUserIds.includes(user.id) && (
                                                        <span className="text-green-400"><CheckIcon /></span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                {isGroup && (
                                    <button
                                        className="mt-3 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded disabled:opacity-50"
                                        disabled={selectedUserIds.length === 0 || creatingChat}
                                        onClick={() => handleCreateChat(selectedUserIds, true)}
                                    >
                                        <CheckIcon /> Oluştur
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto">
                                {loading ? (
                                    <div className="p-4">Yükleniyor...</div>
                                ) : (
                                    chats.map((chat) => (
                                        <div key={chat.chatId} className={`flex items-center gap-3 px-4 py-3 hover:bg-[#2a3942] cursor-pointer border-b border-[#222d34] ${selectedChat?.chatId === chat.chatId ? "bg-[#2a3942]" : ""}`}
                                            onClick={() => setSelectedChat(chat)}>
                                            {chat.profilePictureBase64 ? (
                                                <img src={`data:image/png;base64,${chat.profilePictureBase64}`} alt="profile" className="w-12 h-12 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-xl font-bold">
                                                    {chat.chatName?.[0] || "?"}
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold truncate flex items-center gap-2">
                                                    {chat.chatName}
                                                    {chat.isGroupChat && (
                                                        <span className="text-xs bg-blue-700 text-white px-2 py-0.5 rounded ml-1">Grup</span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-400 truncate">
                                                    {chat.lastMessage}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {chat.lastMessageTime && chat.lastMessageTime !== "0001-01-01T00:00:00" ? timeAgo(chat.lastMessageTime) : ""}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </aside>
                    {selectedChatId ? (
                        <ChatDetailsScreen chatId={selectedChatId} onBack={() => setSelectedChatId(null)} connection={connection} />
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
