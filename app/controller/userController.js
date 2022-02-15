'use strict'
const moment = require('moment');
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

  exports.createUser = async (req, res) => {
    
    const {
      email, firstname, lastname, password,
    } = req.body;
  
    if (isEmpty(email) || isEmpty(firstname) || isEmpty(lastname) || isEmpty(password)) {
      errorMessage.error = 'Email, password, first name and last name field cannot be empty';
      return res.status(status.bad).send(errorMessage);
    }
    if (!isValidEmail(email)) {
      errorMessage.error = 'Please enter a valid Email';
      return res.status(status.bad).send(errorMessage);
    }
    if (!validatePassword(password)) {
      errorMessage.error = 'Password must be more than five(5) characters';
      return res.status(status.bad).send(errorMessage); 
    }
  
    try {

    const checkUser = `SELECT email FROM user_login where email = $1`;
    const isExist = await dbQuery.query(checkUser, [email]);
    if(isExist.rows.length > 0){
      errorMessage.error = 'Email ID Already Exist';
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
      return res.status(status.created).send(successMessage);
    } catch (error) {
      console.log(error)
      if (error.routine === '_bt_check_unique') {
        errorMessage.error = 'User with that EMAIL already exist';
        return res.status(status.conflict).send(errorMessage);
      }
      errorMessage.error = 'Operation was not successful';
      return res.status(status.error).send(errorMessage);
    }
  };


  exports.siginUser = async (req, res) => {
    const { email, password } = req.body;

    if (isEmpty(email) || isEmpty(password)) {
      errorMessage.error = 'Email or Password detail is missing';
      return res.status(status.bad).send(errorMessage);
    }
    if (!isValidEmail(email) || !validatePassword(password)) {
      errorMessage.error = 'Please enter a valid Email or Password';
      return res.status(status.bad).send(errorMessage);
    }


    try {
      const signinUserQuery = 'SELECT * FROM user_login WHERE email = $1';
      const { rows } = await dbQuery.query(signinUserQuery, [email]);
      const dbResponse = rows[0];

      if (!dbResponse) {
        errorMessage.error = 'User with this email does not exist';
        return res.status(status.notfound).send(errorMessage);
      }
      const comparePass = await comparePassword(dbResponse.password, password);
      if (!comparePass) {
        errorMessage.error = 'The password you provided is incorrect';
        return res.status(status.bad).send(errorMessage);
      }

      const token = await generateUserToken(dbResponse.email, dbResponse.id, dbResponse.first_name, dbResponse.last_name);
      delete dbResponse.password;
      successMessage.data = dbResponse;
      successMessage.data.token = token;
      return res.status(status.success).send(successMessage);

    } catch (error) {
      errorMessage.error = 'Operation was not successful';
      return res.status(status.error).send(errorMessage);
    }
  };
  