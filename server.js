import express from "express";
import connectDB from "./config/mongodb.js";
import cors from "cors";
import clientRouter from "./routes/clientRoutes.js";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
  import swaggerFile from './swagger-output.json' with { type: 'json' };

// Routes
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import authRouter from "./routes/auth/auth-routes.js";
import adminProductsRouter from './routes/admin/products-routes.js';
import adminOrderRouter from './routes/admin/order-routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
// Middleware

const allowedOrigins = [
  "http://localhost:5000",
  "https://t-rax-black-hole.vercel.app",
  "https://art-toy-admin.onrender.com",
  "http://localhost:5173", 
  "http://localhost:5174", 
];
app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile))
console.log(`Swagger is running on localhost:${PORT}/api-docs 😎👍`)
// login User
app.use("/client", clientRouter);
//All Product
app.use("/", productRouter);
app.use("/cart", cartRouter);

app.use("/order", orderRouter) 

app.use("/api/auth", authRouter);
app.use("/api/admin/products",adminProductsRouter)
app.use("/api/admin/orders", adminOrderRouter);




app.listen(PORT, () => console.log(`Server running on port ${PORT} 😎 😎 😎 `));
