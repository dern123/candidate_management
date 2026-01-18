import express from 'express';
import cors from 'cors';
import candidatesRouter from './routes/candidates';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK'});
});
app.use('/api/candidates', candidatesRouter);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
});

export default app;