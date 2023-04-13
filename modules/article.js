import { Schema, model } from "mongoose";

const PostSchema = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    src: { type: Schema.Types.String, required: true },
    comments: { type: Array },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
}, {timestamps: true})

const Post = model("Post", PostSchema)
export default Post