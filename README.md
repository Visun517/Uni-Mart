````md
# 🛒 Uni-Mart  
### University Marketplace Mobile Application

## 📌 Project Overview

**Uni-Mart** is a mobile marketplace application designed specifically for **university students**.  
It enables students to **buy, sell, and manage second-hand or new items** within a secure and user-friendly environment.

The application is developed using **Expo (React Native)** with **Firebase**, **Cloudinary**, and **Expo Router**, following modern mobile application development best practices.

---

## 🚀 Features

- 🔐 Firebase Authentication (Email & Google OAuth)
- 🏠 Home feed with item listings
- ➕ Create, edit & delete advertisements
- 🖼️ Image upload using Cloudinary
- 👤 User profile & ad management
- 📄 Dynamic item detail pages
- 📱 Mobile-optimized UI
- ⚡ File-based routing using Expo Router
- 🎨 Tailwind-style UI with NativeWind

---

## 🛠️ Tech Stack

| Category | Technology |
|--------|------------|
| Mobile Framework | Expo (React Native) |
| Language | TypeScript |
| Routing | Expo Router |
| Authentication | Firebase Auth |
| Database | Firebase |
| Image Hosting | Cloudinary |
| Styling | NativeWind (Tailwind CSS) |
| State Management | React Context API |

---

## 📦 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Visun517/Uni-Mart.git
cd Uni-Mart
```

### 2️⃣ Install Dependencies

```bash
npm install
```

---

## 🔐 Environment Variables Setup

Create a `.env` file in the **root directory** and add the following:

```env
# Firebase Config
EXPO_PUBLIC_API_KEY=your_firebase_key
EXPO_PUBLIC_AUTH_DOMAIN=uni-mart-fc8bb.firebaseapp.com
EXPO_PUBLIC_PROJECT_ID=uni-mart-fc8bb
EXPO_PUBLIC_STORAGE_BUCKET=uni-mart-fc8bb.firebasestorage.app
EXPO_PUBLIC_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_APP_ID=your_app_id

# Google OAuth
EXPO_PUBLIC_WEB_CLIENT_ID=your_google_web_id.apps.googleusercontent.com
EXPO_PUBLIC_ANDROID_CLIENT_ID=your_google_android_id.apps.googleusercontent.com
EXPO_PUBLIC_IOS_CLIENT_ID=your_google_ios_id.apps.googleusercontent.com

# Cloudinary
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=uni-mart
```

⚠️ **Important**

* Do **NOT** push the `.env` file to GitHub
* Add `.env` to your `.gitignore` file

---

## ▶️ Run the Application

```bash
npx expo start -c
```

### 📱 Physical Device Testing

```bash
npx expo start --tunnel
```

---

## 📂 Project Structure

```text
├── app/                  
│   ├── (auth)/           # Login & Register Screens
│   ├── (tabs)/           # Home, Add Item, My Ads, Profile
│   ├── listing/          # Dynamic Routes (View/Edit Ads)
│   ├── _layout.tsx       # Root Layout & Providers
│   └── index.tsx         # Entry Point with Auth Redirect
│
├── src/
│   ├── Components/       # Reusable UI Components
│   ├── Context/          # Global Auth Context
│   ├── hooks/            # Custom Hooks
│   ├── Service/          # Firebase & Cloudinary Services
│   └── types/            # TypeScript Interfaces
│
└── tailwind.config.js    # NativeWind Configuration
```
---

## 🧪 Testing

* Manual UI Testing
* Firebase Authentication Validation
* Cloudinary Upload Verification
* Expo Device Testing (Android)

---

## 👨‍💻 Developed By

**Visun Prabodha**
🎓 Advanced Mobile Application Development
🏫 University Project

---

## ⭐ Support

If you find this project useful, please give it a **star ⭐** on GitHub.






