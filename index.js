import dotenv from "dotenv"
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
import axios from "axios";
import mongoose from "mongoose";
import User from "./models/user.js";
import express from "express";
import cors from "cors";
import routes from "./routes/users.js";

const dbUrl = process.env.ATLAS_URI;

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conection OPEN in MONGO!");
  })
  .catch((err) => {
    console.log("OH NO ERROR in MONGO!!!");
    console.log(err);
});

const seedDB = async () => {
  const count = await User.countDocuments()
  if(count === 0){
      const info = await axios.get("https://random-data-api.com/api/v2/users?size=100&is_xml=true")
      let data = info.data;
      for (let i = 0; i < data.length; i++) {
                const user = new User({
                    first_name: data[i].first_name,
                    last_name: data[i].last_name,
                    phone_number: data[i].phone_number,
                    id: data[i].id,
                    gender: data[i].gender,
                    username: data[i].username,
                    employment: {
                        key_skill: data[i].employment.key_skill,
                        title: data[i].employment.title
                    },
                    email: data[i].email,
                    avatar: data[i].avatar
            })
            await user.save();
        }
  }  
}

seedDB().then(() => {});

const app = express();

app.use(cors());
  
app.use("/", routes);
  
const PORT = process.env.PORT || 5000;
  
app.listen(PORT, () => {
    console.log(`Serving from port: ${PORT}`);
});
