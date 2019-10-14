const Sequelize = require('sequelize')
const conn = require('../database/connection')
//console.log("heloooooooooooooooooooooooo" + conn)
module.exports = conn.define("user", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey: true
    },
    names: Sequelize.STRING,
    emails:Sequelize.STRING,
    passwords: Sequelize.STRING
},{
    timestamps:false
})