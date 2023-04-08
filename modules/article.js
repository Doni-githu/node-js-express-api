import { Schema, model } from "mongoose";

const ArticleSchema = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
})

const Article = model("User", ArticleSchema)
export default Article