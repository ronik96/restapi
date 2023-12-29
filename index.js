import express from 'express';
import router from './router/router.js';
import errorhandler from './middleware/errorhandler.js';
import mongoose from 'mongoose';
import { DB_URL, APP_PORT } from './config/index.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
mongoose.set('strictQuery', false)
mongoose.connect(DB_URL, { useNewUrlParser: true })

const app = express();
app.use('./uploads', express.static('./uploads'))
const __dirname = dirname(fileURLToPath(import.meta.url))
global.AppRoot = path.resolve(__dirname);


app.use(express.json());
app.use('/upload', express.static('upload'))

app.use(router);
app.use(errorhandler);


app.listen(APP_PORT, () => {
    console.log("server is running ");
});