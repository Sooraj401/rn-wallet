import express from 'express';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';
import rateLimiter from './middleware/rate-limiter.js';
import transactionsRoute from './routes/transactions-routes.js';
import job from './config/cron.js';

dotenv.config();

const app = express();

if(process.env.NODE_ENV === 'production') job.start();

// Middleware
app.use(rateLimiter);
app.use(express.json());

const PORT = process.env.PORT || 8001;

// Routes
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "UP",
    })
})
app.use("/api/transactions", transactionsRoute);

// initializing the database and starting the server
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error("Failed to initialize the server:", error);
    process.exit(1);
});