const express = require('express');
const app = express();
const env = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
env.config();
const keys = require('./config/keys');
const UserSchema = require('./models/authSchema');

//middleware for the facebook auth
passport.use(new FacebookStrategy({
    clientID: '443513606598385',
    clientSecret: 'd2c35c98ccd2902314d3f8a0daac67c2',
    callbackURL: "http://localhost:3000/auth/facebook/callback"
},
    (accessToken, refreshToken, profile, done) => {
        console.log(accessToken);
        console.log(profile)
    }
));



//middleware for the google auth
passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: 'http://localhost:3000/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    console.log(accessToken);
    console.log('passport callback function fired')
    console.log(profile);
    UserSchema.findOne({ googleId: profile.id })
        .then(currentUser => {
            if(currentUser) {
                //already exist
                console.log('Already Exist...');
            } else {
                new UserSchema({
                    name: profile.displayName,
                    googleId: profile.id
                }).save().then(user => {
                    console.log(user)
                })
            }

        })

}))

//middleware for the github auth
passport.use(new GitHubStrategy({
    clientID: '5b440741849fb1f0dff4',
    clientSecret: 'd0c959769a18a99b612fef043bf42454b6132234',
    callbackURL: "http://localhost:3000/auth/github/callback"
},
    (accessToken, refreshToken, profile, cb) => {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
    }
));

//our auth routes

//login with Gmail route    
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
})
);

app.get('/auth/google/callback', passport.authenticate('google'), (req, res, next) => {
    res.send("Callback URI for google route here ");
})

//login with Facebook route
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', (req, res, next) => {
    res.send("Callback URI for facebook route here");
})
//login with github account 

app.get('/auth/github',
    passport.authenticate('github'));


app.get('/auth/github/callback', (req, res, next) => {
    res.send("Callback URI for github route here");
})



app.listen(3000, (err) => {
    if (err) {
        console.log("err to start the server");
    }
    mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
        if (!err) {
            console.log("Db connected success....");
        }
    })
    console.log("Server started success....");
});