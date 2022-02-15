const env = require('../../env');
const bcrypt = require("bcryptjs");
const {
  errorMessage, successMessage, status,
} = require ('../helper/status');

const isValidEmail = (email) => {
    const regEx = /\S+@\S+\.\S+/;
    return regEx.test(email);
}


const validatePassword = (password) => {
    if (password.length <= 5 || password === '') {
      return false;
    } return true;
  };


  const isEmpty = (input) => {
    if (input === undefined || input === '') {
      return true;
    }

    if (input.replace(/\s/g, '').length) {
      return false;
    } return true;
  };


  const empty = (input) => {
    if (input === undefined || input === '') {
      return true;
    }
  };

  const hashPassword = async (input) => {
    return new Promise(async (resolve,reject)=>{
      if(input === '') return false;
      
      bcrypt.genSalt(10, (err, Salt)=> {
        bcrypt.hash(input, Salt, (err, hash)=> {
      
            if (err) {
                return console.log('Cannot encrypt');
            }
      
            bcrypt.compare(input, hash, async function (err, isMatch) {
                if (isMatch) {  
                    resolve(hash)
                }
      
            })
        })
    });
    })
  }
 
  const comparePassword = async (hash,pass) => {
    return new Promise(async (resolve,reject)=>{
      if(pass === '' || hash === '') return false;

      bcrypt.genSalt(10, (err, Salt)=> {
                  
        bcrypt.compare(pass, hash, async function (err, isMatch) {
                if (isMatch) {  
                    resolve(true)
                }else{
                  reject(false)
                }
      
            })
    });
    })
    .then(result => result)
    .catch(error => error)
  }

  module.exports = {
    isValidEmail,
    validatePassword,
    isEmpty,
    empty,
    comparePassword,
    hashPassword
  };