import express from 'express'
import app from './config/appConfig.js'

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`LISTENING on port ${PORT}`);
});