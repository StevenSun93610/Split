import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// assumes that User was registered in `./db.mjs`
const User = mongoose.model('User');

const startAuthenticatedSession = (req, user, cb) => {
  // TODO: implement startAuthenticatedSession
  req.session.regenerate(function(err) {

    if (!err){
      req.session.user = {};
      req.session.user.username = user.username;
      req.session.user._id = user._id;
    }else{
      console.log(err);
    }
    cb(err);
  });
};

const endAuthenticatedSession = (req, cb) => {
  req.session.destroy((err) => { cb(err); });
};


const register = (username, email, password, errorCallback, successCallback) => {
  // TODO: implement register
  const errObject = {};
  if (username.length < 8 || password.length < 8){
    errObject.message = "USERNAME PASSWORD TOO SHORT";
    console.log("USERNAME PASSWORD TOO SHORT");
    errorCallback(errObject);
    return;
  }

  User.findOne({username: username }, (err, result) => {
    if (err){
      errObject.message = err.toString();
      console.log(err);
      errorCallback(errObject);
      return;
    }
    if (result){
      errObject.message = "USERNAME ALREADY EXISTS";
      console.log("USERNAME ALREADY EXISTS");
      errorCallback(errObject);
      return;
    }else{
        // you can use a default value of 10 for salt rounds 
        bcrypt.hash(password, 10, function(err, hash) {
          if (err){
            errObject.message = err.toString();
            console.log(err);
            errorCallback(errObject);
            return;
          }
          const newUser = new User({
            username: username,
            password: hash,
            friends: [],
            bills: []
          });
          // console.log(newUser);
          newUser.save(function(err, newUser){
            if (err){
              console.log(err);
              errObject.message = "DOCUMENT SAVE ERROR";
              console.log("DOCUMENT SAVE ERROR");
              errorCallback(errObject);
              return;
            }
            successCallback(newUser);
          });
        });
    }
  });
};

const login = (username, password, errorCallback, successCallback) => {
  // TODO: implement login
  const errObject = {};
  User.findOne({username: username}, (err, user) => {
    if (!err && user) {
      bcrypt.compare(password, user.password, (err, passwordMatch) => {
        if (err){
          errObject.message = err.toString();
          console.log(err);
          errorCallback(errObject);
          return;
        }

        if (passwordMatch){
          successCallback(user);
        }else{
          errObject.message = "PASSWORDS DO NOT MATCH";
          console.log("PASSWORDS DO NOT MATCH");
          errorCallback(errObject);
          return;
        }
      });
    }else{
      errObject.message = "USER NOT FOUND";
      console.log("USER NOT FOUND");
      errorCallback(errObject);
      return;
    }
   });
};

// creates middleware that redirects to login if path is included in authRequiredPaths
const authRequired = authRequiredPaths => {
  return (req, res, next) => {
    if(authRequiredPaths.includes(req.path)) {
      if(!req.session.user) {
        res.redirect('/login'); 
      } else {
        next(); 
      }
    } else {
      next(); 
    }
  };
};

export {
  startAuthenticatedSession,
  endAuthenticatedSession,
  register,
  login,
  authRequired
};
