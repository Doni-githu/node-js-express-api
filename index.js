import express from "express"
import * as dotenv from "dotenv"
dotenv.config()
import mongoose from "mongoose";
import cors from "cors"
import UserRoutes from "./routes/user.js"
import Article from "./routes/article.js";

const app = express()


app.use(express.json())
app.use(cors({
    origin: '*',
    allowedHeaders: '*',
    exposedHeaders: '*',
    credentials: 'true'
}))



app.use('/routes/uploads', express.static('./routes/uploads'))
app.use("/api/article", Article)
app.use("/api/users", UserRoutes)

function Server() {
    const PORT = process.env.PORT ?? 2000
    mongoose.connect(process.env.MONGO_URI)
        .then((res) => console.log("Mongo DB was connected"))
        .catch((err) => console.log("Mongo DB can't connect, because " + err))
    app.listen(PORT, () => {
        console.log("Server are running on port " + PORT);
    })
}
Server()