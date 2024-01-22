const mysql = require("mysql");

const connection = mysql.createConnection({
    host: process.env.HOST_NAME,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err)
    {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the MySql database');
    }
});

module.exports = connection;