
import express from 'express'
import './config/envConfig.js';
import chatRoutes from './routes/chatRoutes.js';
import webhookRoutes from './routes/webhooks.js';

const app = express();

app.use(express.json());
app.use(chatRoutes);
app.use(webhookRoutes);

export default app