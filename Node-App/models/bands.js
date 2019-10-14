const Sequelize = require('sequelize')
const conn = require('../database/connection')
module.exports = conn.define("bands", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    names: Sequelize.STRING,
    description: Sequelize.TEXT
}, {
    timestamps: false
})