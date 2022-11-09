import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    hash: String,
    salt: String,
    isAdmin: {type: Boolean, default: false}
});

const user = mongoose.model("User", userSchema);
export default user