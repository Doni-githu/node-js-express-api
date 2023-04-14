import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    username: { type: String, required: true},
    email: { type: String, required: true },
    password: { type: String, required: true },
})

const User = model("Users", UserSchema)
export default User