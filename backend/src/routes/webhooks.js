import express from 'express';
import {webhookController,webhookControllerPost} from '../controllers/webhookControllers.js'

const router = express.Router();

router.get('/webhook', webhookController)
router.post('/webhook', webhookControllerPost)

export default router;