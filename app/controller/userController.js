'use strict'
const moment  = require('moment');
const dbQuery = require('../db/dbQuery');
const {
    hashPassword,
    isValidEmail,
    validatePassword,
    comparePassword,
    isEmpty,
  } = require( '../helper/validation');
  const {generateUserToken} = require('../middleware/verifyAuth');

  const {
    errorMessage, successMessage, status,
  } = require ('../helper/status');
  const logRequest = require('../middleware/apiRequest');

  exports.createUser = async (req, res) => {
    
    const {
      email, firstname, lastname, password,
    } = req.body;
  
    if (isEmpty(email) || isEmpty(firstname) || isEmpty(lastname) || isEmpty(password)) {
      errorMessage.error = 'Email, password, first name and last name field cannot be empty';
      errorMessage.responsecode = status.bad;
      await logRequest.requestDump(req,status.bad,1);
      return res.status(status.bad).send(errorMessage);
    }
    if (!isValidEmail(email)) {
      errorMessage.error = 'Please enter a valid Email';
      errorMessage.responsecode = status.bad;
      await logRequest.requestDump(req,status.bad,1);
      return res.status(status.bad).send(errorMessage);
    }
    if (!validatePassword(password)) {
      errorMessage.error = 'Password must be more than five(5) characters';
      errorMessage.responsecode = status.bad;
      await logRequest.requestDump(req,status.bad,1);
      return res.status(status.bad).send(errorMessage); 
    }
  
    try {

    const checkUser = `SELECT email FROM user_login where email = $1`;
    const isExist = await dbQuery.query(checkUser, [email]);
    if(isExist.rows.length > 0){
      errorMessage.error = 'Email ID Already Exist';
      errorMessage.responsecode = status.bad;
      await logRequest.requestDump(req,status.bad,1);
      return res.status(status.bad).send(errorMessage);
    };
    
      const encrytpass = await hashPassword(password);

      const createUserQuery = `INSERT INTO
          user_login(email, firstname, lastname, password)
          VALUES($1, $2, $3, $4)
          returning *`;
      
      const values = [
        email,
        firstname,
        lastname,
        encrytpass,
      ];
      const { rows } = await dbQuery.query(createUserQuery, values);
      const dbResponse = rows[0];
      delete dbResponse.password;
     
      successMessage.data = dbResponse;
      errorMessage.responsecode = status.created;
      
      await logRequest.requestDump(req,status.created,1);
      return res.status(status.created).send(successMessage);
    } catch (error) {
      console.log(error)
      if (error.routine === '_bt_check_unique') {
        errorMessage.error = 'User with that EMAIL already exist';
        errorMessage.responsecode = status.conflict;
        await logRequest.requestDump(req,status.conflict,1);
        return res.status(status.conflict).send(errorMessage);
      }
      errorMessage.error = 'Operation was not successful';
      errorMessage.responsecode = status.error;
      await logRequest.requestDump(req,status.error,1);
      return res.status(status.error).send(errorMessage);
    }
  };


  exports.siginUser = async (req, res) => {
    const { email, password } = req.body;

    if (isEmpty(email) || isEmpty(password)) {
      errorMessage.error = 'Email or Password detail is missing';
      errorMessage.responsecode = status.bad;
      await logRequest.requestDump(req,status.bad,2);
      return res.status(status.bad).send(errorMessage);
    }
    if (!isValidEmail(email) || !validatePassword(password)) {
      errorMessage.error = 'Please enter a valid Email or Password';
      errorMessage.responsecode = status.bad;
      await logRequest.requestDump(req,status.bad,2);
      return res.status(status.bad).send(errorMessage);
    }


    try {
      const signinUserQuery = 'SELECT * FROM user_login WHERE email = $1';
      const { rows } = await dbQuery.query(signinUserQuery, [email]);
      const dbResponse = rows[0];

      if (!dbResponse) {
        errorMessage.error = 'User with this email does not exist';
        errorMessage.responsecode = status.notfound;
        await logRequest.requestDump(req,status.notfound,2);
        return res.status(status.notfound).send(errorMessage);
      }
      const comparePass = await comparePassword(dbResponse.password, password);
      if (!comparePass) {
        errorMessage.error = 'The password you provided is incorrect';
        errorMessage.responsecode = status.bad;
        await logRequest.requestDump(req,status.bad,2);
        return res.status(status.bad).send(errorMessage);
      }

      const token = await generateUserToken(dbResponse.email, dbResponse.id, dbResponse.firstname, dbResponse.lastname);
      delete dbResponse.password;
      successMessage.data = dbResponse;
      successMessage.data.token = token;
      successMessage.responsecode = status.success;
      await logRequest.requestDump(req,status.success,2,dbResponse.id);
      return res.status(status.success).send(successMessage);

    } catch (error) {
      errorMessage.error = 'Operation was not successful';
      successMessage.responsecode = status.error;
      await logRequest.requestDump(req,status.error,2);
      return res.status(status.error).send(errorMessage);
    }
  };

  exports.userLogs = async (req, res) => {
    try{
      let from_date = req.query.from_date
      let to_date = req.query.to_date
      let UserLogQuery ="";
      let value = "";
      if(!("from_date" in req.query) || !("to_date" in req.query)){
        UserLogQuery = `SELECT CASE WHEN type =1 THEN 'total_login_count' WHEN type =2 THEN 'total_signup_count' END typeCount,count(type) FROM request_log_dump where type in  (1,2) group by type`;
      }else{
        UserLogQuery = `SELECT CASE WHEN type =1 THEN 'total_login_count' WHEN type =2 THEN 'total_signup_count' END typeCount,count(type) FROM request_log_dump where type in  (1,2) group by type AND between $1 and $2`;
        value = [
          from_date,
          to_date
        ]
      }
      
      let newObject = {};
      const { rows } = await dbQuery.query(UserLogQuery, value);
      if(rows.length > 0){
        let rowsNew = rows.map(e => {
            return newObject[e.typecount] = Number(e.count);
        })
        successMessage.data = [newObject]
      }else{
        successMessage.message = "No Data Found";
      }
      successMessage.responsecode = status.success;
      await logRequest.requestDump(req,status.success,3);
      return res.status(status.success).send(successMessage);
    }catch(error){
      errorMessage.message = "Unable to fetch data";
      errorMessage.responsecode = status.error;
      await logRequest.requestDump(req,status.error,3);
      return res.status(status.error).send(errorMessage);
    } 

  }
  