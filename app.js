import dotenv from "dotenv"
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
import express from "express";
import mongoose from "mongoose";
import axios from "axios";
import session from "express-session";
import passport from "passport";
import routes from "./routes/index.js"
import cors from "cors";
import connectMongo from "connect-mongo"
import Candidate from "./models/candidate.js";
var app = express();
const corsConfig = {
  origin: true,
  credentials: true,
};
app.use(cors(corsConfig));
app.options('*', cors(corsConfig));

const dbUrl = process.env.DB_STRING;

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
  const count = await Candidate.countDocuments()
  if(count === 0){
      const info = await axios.get("https://random-data-api.com/api/v2/users?size=100&is_xml=true")
      let data = info.data;
      for (let i = 0; i < data.length; i++) {
                const user = new Candidate({
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


const MongoStore = connectMongo(session);
const sessionStore = new MongoStore({mongooseConnection: mongoose.createConnection(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}), collection: 'sessions'})

import "./config/passport.js";

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge:1000*60*60*24
    } }));

app.use(passport.initialize());
app.use(passport.session());

// app.use((req,res,next)=>{
//     console.log(req.session)
//     console.log(req.user)
//     next();
// })
  
app.use("/", routes);

const PORT = process.env.PORT || 5000;
  
app.listen(PORT, () => {
    console.log(`Serving from port: ${PORT}`);
});