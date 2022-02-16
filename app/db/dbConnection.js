const pool = require('./pool');


pool.on('connect',()=>{
    console.log("Connected to db");
})

/**Create User table */
const createUserTable = async () => {
        const Usercreatequery = `CREATE TABLE IF NOT EXISTS user_login
    (id SERIAL PRIMARY KEY,
        email VARCHAR(150) NOT NULL,
        firstname VARCHAR(150) NOT NULL,
        lastname VARCHAR(150) NOT NULL,
        password VARCHAR(150) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `;

    await pool.query(Usercreatequery)
    .then((res)=>{
        console.log(res);
    })
    .catch((err) =>{
        console.log(err);
    })
    .finally(() => pool.end());
}

/**Create api request log dump table */
const createRequestLog = async () => {
    const CreatelogTable = `CREATE TABLE IF NOT EXISTS request_log_dump
    (id SERIAL PRIMARY KEY,
        api_path VARCHAR(150) NOT NULL,
        method VARCHAR(100) NOT NULL,
        response_status_code INT NOT NULL,
        type INT DEFAULT 0 NOT NULL,
        user_id INT DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
    )
    `;
    
    await pool.query(CreatelogTable)
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    })
    .finally(() => pool.end());
}

pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
  });

/**Create all table */
exports.createAllTables = () => {
    createUserTable();
    createRequestLog();
}

require('make-runnable');
