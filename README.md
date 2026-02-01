code
Markdown
# 🎓 Uni-Mart: Campus Marketplace Mobile App

**Uni-Mart** is a modern, high-performance mobile application exclusively designed for university students. It serves as a secure and efficient platform to buy and sell campus essentials like textbooks, electronics, and furniture within the university community.

---

## 🚀 Key Features

### 🔐 Secure Authentication
*   **Firebase Integration:** Robust Email/Password registration and login.
*   **Social Logins:** One-tap sign-in with **Google** and **Facebook** using Expo Auth Session and Firebase.

### 📦 Dynamic Item Listings (CRUD)
*   **Create:** Post advertisements with high-quality images, titles, prices, and categories.
*   **Read:** Browse all listings on a modern home screen or view detailed item pages.
*   **Update:** Edit existing ads to keep information current (Title, Price, Image, etc.).
*   **Delete:** Remove sold or unwanted advertisements instantly.

### 🖼️ Advanced Media Handling
*   **Camera & Gallery:** Seamlessly capture or pick images using `expo-image-picker`.
*   **Cloudinary Hosting:** Fast, optimized image uploads using **Cloudinary Unsigned Presets**, ensuring a lag-free experience without a heavy backend.

### 🔍 Smart Search & Filtering
*   **Real-time Search:** Instantly find items by keywords.
*   **Category Chips:** Horizontal category filtering (Electronics, Books, Fashion, Furniture, etc.) for quick browsing.

### 📱 User Interaction
*   **Direct Calling:** Integrated "Call Seller" feature using the React Native Linking API.
*   **My Ads Dashboard:** A dedicated space for users to manage their own listings and track their sales.

---

## 🛠️ Technical Stack

*   **Framework:** [React Native](https://reactnative.dev/) with [Expo SDK 51+](https://expo.dev/)
*   **Navigation:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based Routing)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
*   **Backend & Database:** [Firebase](https://firebase.google.com/) (Firestore & Authentication)
*   **Image Storage:** [Cloudinary](https://cloudinary.com/)
*   **Icons:** [Lucide React Native](https://lucide.dev/) & [Material Icons](https://icons.expo.fyi/)

---

## 📦 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Visun517/Uni-Mart.git
cd Uni-Mart

2. Install dependencies
```bash
npm install

3. Setup Environment Variables
Create a .env file in the root directory and add your credentials:

Env

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

---

4. Start the application
code
Bash
npx expo start -c

Tip: Use npx expo start --tunnel to test on a physical device across different networks.

---

📂 Project Structure
code
Text
├── app/                  # Main application routes (Expo Router)
│   ├── (auth)/           # Login and Register screens
│   ├── (tabs)/           # Tab navigation (Home, Add Item, My Ads, Profile)
│   ├── listing/          # Dynamic routes: [id].tsx (View) & edit-[id].tsx (Edit)
│   ├── _layout.tsx       # Root layout with SafeArea & Auth Providers
│   └── index.tsx         # App entry point with Auth Redirect Logic
├── src/
│   ├── Components/       # Reusable UI (PostCard, InputField, CustomButton)
│   ├── Context/          # AuthContext for global user & loading state
│   ├── hooks/            # Custom hooks (useAuth, useLoader)
│   ├── Service/          # Firebase, Post, and Cloudinary services
│   └── types/            # TypeScript interfaces (Post.ts, User.ts)
└── tailwind.config.js    # NativeWind configuration

---

📸 Screenshots

Home Screen	Item Details	Create Ad

![alt text](https://via.placeholder.com/200x400?text=Home+Screen)
![alt text](https://via.placeholder.com/200x400?text=Item+Details)
![alt text](https://via.placeholder.com/200x400?text=Create+Ad)

---

👨‍💻 Developed By
Visun Prabodha
Advanced Mobile Application Development - University Project
