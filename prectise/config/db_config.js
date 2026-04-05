const mySql = require('mysql2/promise');

const mySqlpool = mySql.createPool({
     host : "localhost",
     user : "root",
     password : "",
     database : "figma_deals_on_demands",
});

mySqlpool.getConnection((err, connection) => {
    if (err) {
        console.error("Error connecting to database:", err);
        return;
    }
    console.log("Connection Successful!");
    connection.release();
});

module.exports = mySqlpool;