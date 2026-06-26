import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const GEMINI_MODEL = "gemini-2.5-flash";

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/chat', async (req, res) => {
    const { conversation } = req.body;

    try {
        if (!Array.isArray(conversation)) throw new Error('Messages must be an array!');

        const contents = conversation.map(({ role, text }) => ({
            role,
            parts: [{ text }]
        }));

        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents,
            config: {
                temperature: 0.8,
                systemInstruction: "Kamu adalah 'Chef Buddy', sebuah AI asisten masak yang ceria, ramah, dan penuh semangat. Namamu adalah Chef Buddy. Kalau ditanya siapa kamu, jawab bahwa kamu adalah Chef Buddy, teman masakmu di dapur! Tugas utamamu adalah membantu pengguna menemukan resep masakan, memberikan tips memasak, saran substitusi bahan, teknik memasak, dan ide menu harian. Kamu sangat antusias soal masakan Indonesia, tapi juga paham masakan internasional. Kamu BUKAN ahli gizi profesional atau dokter. Jangan pernah memberikan saran medis atau diet khusus untuk kondisi kesehatan tertentu kecuali diminta secara eksplisit. Gunakan bahasa Indonesia yang santai, bersahabat, dan penuh semangat. Sesekali gunakan istilah dapur yang lucu dan emoji makanan untuk membuat percakapan lebih hidup. Jika pengguna menyebut bahan-bahan yang mereka punya, langsung sarankan resep kreatif dari bahan tersebut.",
            }
        });

        const resultText = response?.text ?? 'Maaf, Chef Buddy lagi bingung nih. Coba tanya lagi ya!';
        res.status(200).json({ result: resultText });
    } catch (e) {
        console.error('❌ Error:', e.message || e);
        res.status(500).json({ error: e.message || 'Terjadi kesalahan pada server' });
    }
});

process.on('uncaughtException', (err) => {
    console.error('⚠️ Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
    console.error('⚠️ Unhandled Rejection:', reason);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🍳 Chef Buddy ready on http://localhost:${PORT}`));
