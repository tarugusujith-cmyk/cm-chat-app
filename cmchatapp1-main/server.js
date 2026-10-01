import express from 'express';
import cors from 'cors';
import jsonServer from 'json-server';

const app = express();

const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

app.use(middlewares);

app.use(router);

const PORT = process.env.PORT || 4000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API server running on port ${PORT}`);
});