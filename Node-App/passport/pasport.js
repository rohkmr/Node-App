const LocalStrategy = require('passport-local').Strategy;
const conn = require('../database/connection')
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/users');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // Match user
            User.findOne({
                where: { emails: email }
            }).then(user => {
                //req.flash('useremail',user.emails)
                console.log("from passport........................" + user.emails)
                if (!user) {
                    console.log("inside !!!!!!!!!!!!!user...............")
                    return done(null, false, { message: 'That email is not registered' });
                }

                // Match password
                // bcrypt.compare(password, user.password, (err, isMatch) => {
                //   if (err) throw err;
                console.log("password================" + password)
                console.log("user password===================" + user.passwords)
                if (password == user.passwords) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Password incorrect' });
                }
                // });
            });
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findOne({
            id: id
        }).then((user) => {
            if (!user) {
                return done(new Error("No such User"))
            }
            return done(null, user)
        }).catch((err) => {
            done(err)
        })
    });
};