import express from 'express';
import {promptController} from '../controllers/chatControllers.js'

const router = express.Router();
router.post('/digiteseuprompt', promptController);

export default router;
