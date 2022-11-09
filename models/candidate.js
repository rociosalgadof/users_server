import mongoose from "mongoose";
const Schema = mongoose.Schema;

const candidateSchema = new Schema({
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

const candidate = mongoose.model("Candidate", candidateSchema);
export default candidate