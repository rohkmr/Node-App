const express = require('express')
const route = express.Router()
const conn = require('../database/connection')
const usermodel = require('../models/users')
const band = require('../models/bands')
const passport = require('passport')


//login
route.get('/login', (req, res) => {
    res.render("login")
})

//register

route.get('/register', (req, res) => {
    res.render("register")
})

//Register Handle
route.post('/register', (req, res) => {
    console.log("register body=======" + req.body)
    const { name, email, password, password2 } = req.body
    console.log("name from register=================" + name)
    //Errors
    let errors = []

    //Check req fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'plese fill in all fields' })
    }

    //Check Password match
    if (password != password2) {
        errors.push({ msg: 'password do not match' })
    }

    //Check password length
    if (password.length < 6) {
        errors.push({ msg: 'password length shuld be atleast 6 character' })
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        //res.send('pass')
        // conn.sync({
        //     logging: console.log,
        // }).then(() => {
        //     usermodel.create({
        //         names: name,
        //         emails: email,
        //         passwords: password
        //     }
        //     )
        // }).then((data) => {
        //     console.log(data)
        // })
        usermodel.findOne(
            {
                where: { emails: email }
            }).then(usermodel => {
                //User Exist
                console.log("userrrrrrrrrrrrrrrrrrrrrrrr" + usermodel.emails)
                if (usermodel) {
                    errors.push({ msg: 'Email is already exist' })
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })

                } else {
                    console.log("adding data to database......................")
                    conn.sync({
                        logging: console.log,
                    }).then(() => {
                        console.log("just before creating")
                        usermodel.create({
                            names: name,
                            emails: email,
                            passwords: password
                        })
                    }).then((data) => {
                        console.log(data)
                    })
                }

            }).catch(err => {
                conn.sync({
                    logging: console.log,
                }).then(() => {
                    console.log("just before creating")
                    usermodel.create({
                        names: name,
                        emails: email,
                        passwords: password
                    })
                }).then((data) => {
                    console.log(data)
                })
                req.flash('success_msg', 'You are now regestered and can login')

                res.redirect('/users/login')

            })
    }
})

//Login Handle
route.post('/login', (req, res, next) => {

    const { email, password } = req.body
    console.log("email on dashboard============" + email)
    req.flash('useremail', null)
    req.flash('useremail', email)
    req.session.email = null
    req.session.email = email
    //req.session.
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)

})

//Logout handle
route.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'You are logged out')
    res.redirect('/users/login')
})

//Bnads Handle
route.post('/bands', (req, res) => {
    console.log("band data=" + req.body)
    const { name, desc } = req.body

    console.log("name=========================================" + name)
    console.log("name=========================================" + desc)
    let id = req.flash('userId')
    console.log("from bands data===================" + id)
    var bands = band.build({
        names: name,
        description: desc,
        userId: id
    });
    //Inserting Data into database
    bands.save(function (err) {
        if (err) {
            console.log('Error in Inserting Record');
        } else {
            console.log('Data successfully inserted');
        }
    });
    console.log('from bandssssssssssssssssssssssssssss==' + req.flash('useremail'))
    res.redirect('/dashboard')

})

//Delete Handel

route.get('/delete/:id', (req, res) => {

    // res.send("heloooooooooo"+req.params.id)
    band.findByPk(req.params.id).then((bands) => {
        return bands.destroy();
    }).then(() => {
        res.redirect('/dashboard');
    });

})

//Edit Handle
route.post('/edit/:ids', (req, res) => {
    console.log('helooooooooooooooooooooooooooooooooooooooooo'+req.params.ids)
    const name = req.body
    console.log("form edit--------------------------" + name.edit)
    band.findByPk(req.params.ids).then((bands) => {
        return bands.update({names:name.edit});
      }).then((bands) => {
        res.redirect('/dashboard');
      });

})
module.exports = route