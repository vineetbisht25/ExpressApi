const Pool = require('pg').Pool;

const dotenv = require('dotenv');
dotenv.config();
let p = 5
let t = 6

const databaseCofig = 
    {
        user:process.env.POSTGRESQL_USER,
        host:process.env.POSTGRESQL_HOST,
        database:process.env.POSTGRESQL_DB,
        password:process.env.POSTGRESQL_PASSWORD, 
        port:process.env.POSTGRESQL_PORT 
};
const pool = new Pool(databaseCofig);
let substract = p-t
console.log(substract)
module.exports = pool;
