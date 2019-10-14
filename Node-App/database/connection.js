const Sequelize = require('sequelize')

console.log("Connected to database")
const conn = new Sequelize('nodeassignment', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
})
module.exports = conn;