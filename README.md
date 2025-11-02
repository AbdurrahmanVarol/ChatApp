# 💬 ChatApp

Gerçek zamanlı mesajlaşma altyapısını öğrenmek ve SignalR becerilerimi pekiştirmek amacıyla geliştirdiğim bir **real-time chat** uygulamasıdır.

Bu proje, **frontend** tarafında **Next.js**, **backend** tarafında ise **.NET 8 + SignalR** teknolojilerini kullanmaktadır.  
Veri yönetimi için **PostgreSQL** veritabanı tercih edilmiştir.

---

## 🚀 Özellikler

- Gerçek zamanlı mesajlaşma (SignalR ile)
- Kullanıcı bağlantı yönetimi
- Anlık bildirim sistemi
- Modern, responsive arayüz (Next.js)
- Katmanlı backend mimarisi (.NET 8)

---

## 🛠️ Kullanılan Teknolojiler

| Katman | Teknoloji |
|--------|------------|
| Frontend | [Next.js](https://nextjs.org/) |
| Backend | [.NET 8](https://dotnet.microsoft.com/) + [SignalR](https://learn.microsoft.com/aspnet/core/signalr/introduction) |
| Database | [PostgreSQL](https://www.postgresql.org/) |
| İletişim | WebSocket / SignalR Hubs |

---

## ⚙️ Kurulum

### 1. Backend (.NET 8 + SignalR)

```bash
# Backend klasörüne girin
cd ChatApp.Api

# Gerekli bağımlılıkları yükleyin
dotnet restore

# Veritabanı bağlantı ayarlarını (appsettings.json) düzenleyin
# örnek:
# "ConnectionStrings": {
#   "DefaultConnection": "Host=localhost;Port=5432;Database=ChatAppDb;Username=postgres;Password=postgres"
# }

# Migration oluştur ve veritabanını güncelle
dotnet ef database update

# Uygulamayı başlat
dotnet run
```

### 2. Frontend (Next.js)

```bash
# Frontend klasörüne girin
cd ChatApp.Client

# Gerekli paketleri yükleyin
npm install

# Uygulamayı başlat
npm run dev
```

Uygulama varsayılan olarak [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

---

## 🧩 Proje Yapısı

```
ChatApp/
│
├── server/         # .NET 8 backend (SignalR Hub, Controllers, Services)
├── client/      # Next.js frontend
└── README.md
```

---

## 🎯 Öğrenme Hedefleri

Bu proje sayesinde:
- SignalR hub yapısını ve connection yönetimini öğrendim.  
- Gerçek zamanlı mesajlaşma mantığını uçtan uca uyguladım.  
- Frontend ve backend arasında WebSocket tabanlı iletişimi yönettim.  
- Full-stack bir uygulamayı PostgreSQL veritabanı ile entegre ettim.

---

## 🎥 Demo

Aşağıda projenin kısa tanıtım videosunu izleyebilirsiniz 👇  

https://github.com/user-attachments/assets/a7ebb08f-2e7c-4f81-8981-1c5eb905a535

---

### 🏷️ Etiketler
`SignalR` `Next.js` `.NET 8` `PostgreSQL` `WebSockets` `Real-time` `Chat Application`
