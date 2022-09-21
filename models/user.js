import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: String,
    last_name: String,
    phone_number: String,
    id: Number,
    gender: String,
    username: String,
    employment: {
        key_skill: String,
        title: String
    },
    email: String,
    avatar: String
});

const user = mongoose.model("User", userSchema);
export default user
