const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const conn = require('./database/connection')
const serv = express();
const user = require('./models/users')
const bands=require('./models/bands')
const flash = require('connect-flash')
const session = require('express-session')
const passport=require('passport')


//passport config
require('./passport/pasport')(passport)


//EJS
serv.use(expressLayouts)
serv.set('view engine', 'ejs')

//Database 

conn.sync({
    logging: console.log,
}).then(() => {
    console.log("connection to a database established successfully")
})
user.hasMany(bands)

//BodyParser
serv.use(express.urlencoded({ extended: true}))

//Express Session

serv.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

//Passport Middleware
serv.use(passport.initialize())
serv.use(passport.session())

//connect flash

serv.use(flash())

//Global var
serv.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg')
    res.locals.error_msg=req.flash('error_msg')
    //res.locals.error=req.flash('error')
    next()
})


//Routes
serv.use('/', require('./routes/index'))
serv.use('/users', require('./routes/user'))

//Port
const PORT = process.env.PORT || 5000

serv.listen(PORT, () => {
    console.log("listning on http://localhost:5000")
})