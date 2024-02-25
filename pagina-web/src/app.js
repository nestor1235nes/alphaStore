import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth-routes.js';
import cookieParser from 'cookie-parser';
import storeRoutes from './routes/store-routes.js';
import saleRoutes from './routes/sale-routes.js';
import cors from 'cors';
import notificationRoutes from './routes/notification-routes.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api", storeRoutes);
app.use("/api", saleRoutes);
app.use("/api", notificationRoutes);

export default app;