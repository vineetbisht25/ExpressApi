const dbQuery = require('../db/dbQuery');

exports.requestDump =  async(request, response, getType,user_id=0) => {
  return new Promise(async (resolve,reject) => {
    let api_path = request.protocol + '://' + request.get('host') + request.originalUrl;
    let method = request.method;
    let response_status_code = response;
    let type = getType;

      const createUserQuery = `INSERT INTO
      request_log_dump(api_path, method, response_status_code,type,user_id)
      VALUES($1, $2, $3 ,$4, $5)
      returning *`;

      const values = [
        api_path,
        method,
        response_status_code,
        type,
        user_id
      ];
      const {rows} = await dbQuery.query(createUserQuery, values);
      if(rows[0]){
        resolve(true);
      }else{
        reject(true);
      }
  });
 }