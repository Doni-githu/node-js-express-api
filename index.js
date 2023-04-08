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
    origin: '*'
}))

app.use("/api/article", Article)
app.use("/api/users", UserRoutes)

function Server() {
    mongoose.connect(process.env.MONGO_URI,)
        .then((res) => console.log("Mongo DB was connected"))
    app.listen(2000, () => {
        console.log("Server are running on port 2000");
    })
}
Server()