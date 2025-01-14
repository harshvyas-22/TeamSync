import express from 'express';
import morgan from 'morgan';
import connect from './db/db.js';
import userRoutes from './routes/user.routes.js';
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from 'cookie-parser';
import projectRoutes from './routes/project.routes.js';
connect();
const app=express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/projects', projectRoutes);

// Routes
app.use("/users", userRoutes);

app.get('/',(req,res)=>{
    res.send('Hello World');
});

export default app;