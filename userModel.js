const Sequelize = require('sequelize');
const config = require('./config.json');

function userModel(sequelize, DataTypes) {
    return sequelize.define('user', {
        Id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        Name: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        Age: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Mark1: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Mark2: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Mark3: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        tableName: 'user',
        timestamps: false,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "id" },
                ]
            },
        ]
    });
};


let host = config.db.host;
let user = config.db.user;
let password = config.db.password;
let database = config.db.database;


const sequelize = new Sequelize(database, user, password, {
    host: host,
    dialect: "mysql",
    operatorsAliases: false,
    pool: {
        max: 100,
        min: 0,
        acquire: 30000,
        idle: 10000,
        connectTimeout: 60000
    }
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((err) => {
        console.log('Unable to connect to the database:', err);
    });

module.exports = userModel(sequelize, Sequelize);
