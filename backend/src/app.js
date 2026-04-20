
import express from 'express'
import './config/envConfig.js';
import app from './config/appConfig.js'
import chatRoutes from './routes/chatRoutes.js';
import webhookRoutes from './routes/webhooks.js';


app.use(express.json());
app.use(chatRoutes);
app.use(webhookRoutes);
