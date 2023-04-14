import { Schema, model } from "mongoose";

const PostSchema = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    src: { type: Schema.Types.String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'Users' },
    comments: [
        {
            text: String,
            postedBy: { type: Schema.Types.ObjectId, ref: 'Users' }
        }
    ]
}, { timestamps: true })

const Post = model("Post", PostSchema)
export default Post