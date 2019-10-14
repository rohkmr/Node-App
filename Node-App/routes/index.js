const express = require('express')
const route = express.Router()
const bands = require('../models/bands')
const user = require('../models/users')
const { ensureAuthenticated } = require('../passport/auth')
//welcome page
route.get('/', (req, res) => {
    res.render('welcome')
})

//Dashboard

route.get('/dashboard', ensureAuthenticated, (req, res) => {
    let email =req.session.email
    //console.log("email routinggggggggggggggg=="+email)
    console.log("jwndskjndskj"+req.session.email)
    datas = {}
    user.findOne({ where: { emails: email } }).then(data => {
        let id=data.id
        let name=data.name
        let band = []
        req.flash('userId',null)
        req.flash('userId',id)
        bands.findAll({ where: { userId: id} }).then(data => {
            console.log("band data to table==============================" + JSON.stringify(data))
            // band=JSON.parse(JSON.stringify(data))
            band = (data)
            res.render('dashboard', {
                name: datas.names,
                data: band

            })
        })
    })
})

module.exports = route