import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Endpoint for AI Gram Mitra Assistant
  app.post("/api/ai-gram-mitra", async (req, res) => {
    try {
      const { prompt, language = "en", context = "" } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        // Fallback response if GEMINI_API_KEY is not set
        const defaultResponses: Record<string, string> = {
          en: "Welcome to Halashi Gram Panchayat AI Assistant. For Sakala applications, e-Swathu Form 9/11A, or Property Tax payment, please use the Online Services tab or contact PDO Office at +91 83124 56789.",
          kn: "ಹಳಸಿ ಗ್ರಾಂ ಪಂಚಾಯತಿ AI ಸಹಾಯಕ್‌ಗೆ ಸ್ವಾಗತ. ಸಕಾಲ ಅರ್ಜಿಗಳು, ಇ-ಸ್ವತ್ತು ಫಾರ್ಮ್ 9/11A ಅಥವಾ ಆಸ್ತಿ ತೆರಿಗೆ ಪಾವತಿಗೆ ದಯವಿಟ್ಟು ಆನ್‌ಲೈನ್ ಸೇವೆಗಳ ಪೋರ್ಟಲ್ ಬಳಸಿ ಅಥವಾ PDO ಕಚೇರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ."
        };
        return res.json({
          reply: defaultResponses[language] || defaultResponses["en"]
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `You are "Gram Mitra", an official AI Citizen Assistant for Halashi Gram Panchayat in Khanapur Taluk, Belagavi District, Karnataka, India. 
Halashi is an ancient historical village famous as the ancient capital of the Kadambas (5th-12th century CE) and home to the monumental Bhuvaraha Narasimha Temple.
Your task is to politely, clearly, and concisely assist citizens regarding:
1. Government of Karnataka & GOI rural development schemes (MGNREGS, Swachh Bharat Mission, Jal Jeevan Mission, PM-KISAN, Raitha Vidya Nidhi).
2. e-Governance services: e-Swathu (Form 9 & 11A), Bapuji Seva Kendra, Sakala services, Khata property tax, Birth/Death certificates, Trade Licenses, Water Connection NOC.
3. Gram Sabha schedules, GPDP development projects, Citizen Grievance Redressal (Panchayat Spandana).
4. Halashi's heritage, history, tourist guidelines, and Sanjeevini SHG village products.

Answer in the user's requested language (${language === 'kn' ? 'Kannada / ಕನ್ನಡ' : 'English'}). Keep responses structured, accurate, helpful, and citizen-friendly.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      return res.json({ reply: response.text || "No response received." });
    } catch (error: any) {
      console.error("AI Gram Mitra Error:", error);
      res.status(500).json({ error: "Failed to generate AI response", details: error.message });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", village: "Halashi Gram Panchayat", district: "Belagavi" });
  });

  // Vite middleware for dev / express static for prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Halashi Gram Panchayat Portal running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
