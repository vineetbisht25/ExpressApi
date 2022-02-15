const {verify,sign} = require('jsonwebtoken');
const dotenv = require('dotenv');

const {errorMessage,status} = require('../helper/status')

const env = require('../../env');

dotenv.config();

const verifyAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1];

  // if (token == null || !token) return res.status(status.bad).send('Token not provided');

    try {
     verify(token, process.env.TOKEN_SECRET, (err, data)=>{
        req.user = {
          email: data.email,
          user_id: data.id,
          firstname: data.firstname,
          lastname: data.lastname,
        };
      });
      next();
    } catch (error) {
      errorMessage.error = 'Authentication Failed';
      return res.status(status.unauthorized).send(errorMessage);
    }
  };

  const generateUserToken = (data) => {
    return new Promise((resolve, reject)=>{
       sign(data, process.env.TOKEN_SECRET, function(err, token) {
          if(err){
            reject(err);
          }else{
            resolve(token);
          }
        });
    });
  }
  
  module.exports = {verifyAuth,generateUserToken}