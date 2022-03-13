const Pool = require('pg').Pool;

const dotenv = require('dotenv');
dotenv.config();
let a = 3
let b = 4
const databaseCofig = 
    {
        user:process.env.POSTGRESQL_USER,
        host:process.env.POSTGRESQL_HOST,
        database:process.env.POSTGRESQL_DB,
        password:process.env.POSTGRESQL_PASSWORD, 
        port:process.env.POSTGRESQL_PORT 
};
const pool = new Pool(databaseCofig);
let sum = a + b;
console.log(sum)
module.exports = pool;
