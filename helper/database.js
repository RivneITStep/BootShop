const Sequalize = require("sequelize");

const sequalize = new Sequalize("bootshop", "frontend-94", "*frontend*", {
    dialect: "mysql",
    host: "172.17.0.3",
});
module.exports = sequalize;