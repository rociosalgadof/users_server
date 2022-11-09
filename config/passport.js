import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from "../models/user.js"
import { validPassword } from '../lib/passwordUtils.js';

const verifyCallback = (username, password, done)=>{
    User.findOne({username:username})
        .then((user)=>{
            if(!user){ return done(null, false) }
            // if there is not a user found, we are giving passport the answer: the value for user is null, and no (false) it was not found. To this, passport returns a 401 unauthorized http status. 
            const isValid = validPassword(password, user.hash, user.salt)
            if(isValid){
                return done(null, user)
            }else{
                return done(null, false)
            }
        })
        .catch((err)=>{
            done(err)
        })
}

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy)

passport.serializeUser((user, done)=>{
    done(null, user.id);
})

passport.deserializeUser((userId, done)=>{
    User.findById(userId)
    .then((user)=>{
        done(null, user)
    })
    .catch(err=> done(err))
})

