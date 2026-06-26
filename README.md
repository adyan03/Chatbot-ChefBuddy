# 👨‍🍳 Chef Buddy — Teman Masakmu di Dapur!

Chatbot AI asisten masak berbasis **Gemini API** yang membantu pengguna menemukan resep, tips memasak, substitusi bahan, dan ide menu harian.

## 🚀 Cara Menjalankan

### 1. Clone repository

```bash
git clone https://github.com/adyan03/Chatbot-ChefBuddy.git
cd Chatbot-ChefBuddy
```

### 2. Install dependencies

```bash
npm install
```

### 3. Buat file `.env`

Salin file `.env.example` menjadi `.env`, lalu isi dengan API key Gemini milikmu:

```bash
cp .env.example .env
```

Buka file `.env` dan ganti isinya:

```
GEMINI_API_KEY=paste_your_gemini_api_key_here
```

> 💡 API key bisa didapatkan gratis di [Google AI Studio](https://aistudio.google.com/apikey)

### 4. Jalankan server

```bash
npm start
```

### 5. Buka di browser

```
http://localhost:3001
```

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js + Express
- **AI**: Google Gemini 2.5 Flash

## 📁 Struktur Folder

```
chatbot-chef/
├── .env.example       ← Contoh konfigurasi (salin ke .env)
├── .gitignore
├── index.js           ← Server Express + Gemini API
├── package.json
└── public/
    ├── index.html     ← Tampilan chatbot
    ├── style.css      ← Tema warna oranye-merah
    └── script.js      ← Logika chat & markdown parser
```
