import cors from "cors";
import mongoose from 'mongoose';
import * as dotenv from "dotenv";
import express from "express";
import PostRouter from './routes/Posts.js';
import GenerateImageRouter from './routes/GenerateImage.js'


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({limit : "50mb"}));
app.use(express.urlencoded({extended: true}));


// error handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong!";
    return res.status(status).json({
        success:false,
        status,
        message,
    });
});

app.use("/api/post", PostRouter);
app.use("/api/generateImage", GenerateImageRouter)


app.get("/",async(req, res) => {
    res.status(200).json({
        message:"Every thing is fine"
    })
})

// DB connection
const connectDB = () => {
    // mongoose.set("strictQuery", true);
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("MongoDB connected")
    ).catch((err) => console.log("Failed to connect, error: ", err)
    )
}



const startServer = async () => {
    try {
        connectDB();
        app.listen(8080, () => console.log("Server is running on localhost:8080")
        )
    } catch (error) {
        console.log(error);
        
    }
}

startServer();