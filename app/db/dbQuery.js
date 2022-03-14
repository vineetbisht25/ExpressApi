const pool = require('./pool');

exports.query= async (quertText, params) => {
    return new Promise((resolve, reject) => {
       pool.query(quertText, params)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  console.log("none")
