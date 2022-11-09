import passport from "passport"
import express from "express"
import { genPassword } from "../lib/passwordUtils.js";
import User from "../models/user.js"
import { isAuth, isAdmin} from "./authMiddleware.js";
import {
    getCandidates, deleteCandidate
  } from "../controllers/candidates.js";
const router = express.Router();

router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) throw err;
      if (!user) res.status(401).json({msg: 'You are not authorized to view this resource'})
      else {
        req.logIn(user, (err) => {
          if (err) throw err;
          res.send("Successfully Authenticated");
          console.log(req.session);
        });
      }
    })(req, res, next);
  });


 router.post('/register', (req, res, next) => {
    const saltHash = genPassword(req.body.password)
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    const newUser = new User({
        username: req.body.username,
        salt: salt,
        hash: hash
    })

    newUser.save()
    .then((user)=>{
        console.log(user)
        res.json({ success: "User created." })
    })
 });


router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }else{
          res.json({ success: "User logged out." })
        }
      });
});

router.post('/checkUser', (req, res, next) => {
  User.find({ username: req.body.username }, (err, users) => {
    if (!err) {
      if (users.length > 0) {
        res.json({ error: "The username is taken." });
        return;
      }else{
        res.json({ success: "The username is not taken." });
        return;
      }
}})})
router.get("/candidates", getCandidates);
router.delete('/candidates/:id', deleteCandidate);

export default router;