const mysql=require('mysql');

const conn=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:"stmdb"
});
conn.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database successfully!');
});
module.exports = conn;

