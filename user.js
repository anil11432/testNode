import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const userData = mongoose.Schema({
    userName: String,
    email: {
        type: String,
        unique: true
    },
    // 1:user, 2:"Sub Admin", 3: "Admin", 4: "Super Admin"
    role: {
        type: Number,
        default: 1
    },
    token: String
})

export default mongoose.model("UserSchema", userData)