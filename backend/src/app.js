/// arquivo de configuração do app
import express from 'express'
import './config/envConfig.js';
import chatRoutes from './routes/chatRoutes.js';
import webhookRoutes from './routes/webhooks.js';
import cors from "cors";

const app = express();
///implemento cors, e as rotas e o exporto pro servidor
app.use(cors({
    origin: "http://localhost:5173", // ou seu front
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(chatRoutes);
app.use(webhookRoutes);
export default app