import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import mysql from 'mysql2' // npm install mysql2
import path from 'path';
import { fileURLToPath } from 'url';
// __filename과 __dirname을 생성
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import userRoutes from './routes/users.js';
import reviewRoutes from './routes/reviews.js';
import cartRoutes from './routes/carts.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payments.js';

const app = express();
dotenv.config();
//middlewares
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001'], // 클라이언트 url
    credentials: true, // 자격 증명 허용
}
app.use(cors(corsOptions))

// morgan 로깅 미들웨어 사용
app.use(morgan('combined'));
app.use(cookieParser())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});

// MySQL 연결 풀 설정
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// MySQL 연결 풀 연결
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database.');
    connection.release(); // 연결 반환
}); 

app.use('/api2/auth', authRoutes);
app.use('/api2/users', userRoutes);
app.use('/api2/products', productRoutes);
app.use('/api2/reviews', reviewRoutes);
app.use('/api2/carts', cartRoutes);
app.use('/api2/orders', orderRoutes);
app.use('/api2/payments', paymentRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});