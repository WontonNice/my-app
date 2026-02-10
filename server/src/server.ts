import express from 'express';
import cors from 'cors';

const app = express();
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

app.use(cors(corsOptions));

app.get('/api', (req, res) => {
    res.send('Hello!');
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});