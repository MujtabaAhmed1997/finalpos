// const mysql=require('mysql');

// const conn=mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     password:'',
//     database:"stmdb"
// });
// conn.connect((err) => {
//     if (err) {
//         console.error('Error connecting to database:', err);
//         return;
//     }
//     console.log('Connected to database successfully!');
// });
// module.exports = conn;


require('dotenv').config();
const mysql=require('mysql');

const conn=mysql.createConnection({
    host:process.env.host,
    port:process.env.databasename,
    user:process.env.user,
    password:process.env.password,
    database:process.env.dbname
});
conn.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database successfully!', database);
});
module.exports = conn;