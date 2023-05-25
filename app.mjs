import './db.mjs';
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import { createServer } from 'http';
import { Server } from 'socket.io';
import * as helperFn from './helperFn.mjs';
import bcrypt from 'bcryptjs';

const app = express();
const server = createServer(app);
const io = new Server(server);

import path from 'path';
import url from 'url';
import * as auth from './auth.mjs';





const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));

const User = mongoose.model("User");
const Bill = mongoose.model("Bill");


app.use(auth.authRequired(['/','/bills','/friends','/friends/addFriend','/resetPassword','/startBill','/billReport']));


// make {{user}} variable available for all paths
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});
  
// logging
app.use((req, res, next) => {
    console.log(req.method, req.path, req.body);
    next();
});

app.get('/', (req, res) => {
    res.render('index');
});


app.get('/bills', (req, res) =>{
    User.findOne({username: req.session.user.username})
    .populate('bills')
    .exec((err, found) =>{
        if (err){
            console.log(err);
        }else{
            console.log(found);
            if (found){
                // console.log(found);
                res.render('bills', {bills: found.bills});
            }
        }
    });
});

app.get('/startBill', (req, res) =>{
    // console.log(req.session.user);

    User.findOne({username: req.session.user.username})
    .populate('friends')
    .exec((err, found) =>{
        if (err){
            console.log(err);
        }else{
            // console.log(found);
            if (found){
                res.render('startBill', {userName: req.session.user.username, friends: found.friends});
            }else{
                res.redirect('/');
            }
        }
    });
});

app.get('/resetPassword', (req, res) =>{
    res.render('resetPassword');
});

app.post('/resetPassword', (req, res) =>{
    const password = req.body.password;
    const newPassword = req.body.newPassword;
    if (newPassword.length < 8){
        res.render('resetPassword', {message: "Too short"});
    }else{
        User.findOne({username: req.session.user.username}, (err, user) => {
            if (!err && user) {
              bcrypt.compare(password, user.password, (err, passwordMatch) => {
                if (err){
                  console.log(err);
                  return;
                }
                if (passwordMatch){
                    bcrypt.hash(newPassword, 10, function(err, hash){
                        User.updateOne({sername: req.session.user.username}, {"$set": {"password": hash}}, () =>{
                            res.redirect('/');
                        });
                    })
                }else{
                  res.render('resetPassword', {message: "Wrong password"});
                  return;
                }
              });
            }
        });
    }
    
})


app.get('/friends', (req, res)=>{
    const found = User.findOne({username: req.session.user.username}, (err, found) =>{
        res.render('friends', {friends: found.friends});
    });
});


app.get('/friends/addFriend', (req, res) =>{
    res.render('addFriend');
});

app.post('/friends/addFriend',(req, res)=>{
    const friendName = req.body.name;
    User.findOne({username: req.session.user.username}, (err, found) =>{
        const updated = helperFn.inOrNot(found.friends, friendName, 0);
        User.updateOne({username: req.session.user.username}, {"$set": {"friends": updated}}, (err) =>{
            if (err){
                console.log(err);
            }else{
                res.redirect('/friends');
            }
        })
    })

});

  
          

app.get('/register', (req, res) => {
    res.render('register');
  });
  
  app.post('/register', (req, res) => {
    // setup callbacks for register success and error
    function success(newUser) {
      auth.startAuthenticatedSession(req, newUser, (err) => {
          if (!err) {
              res.redirect('/');
          } else {
              res.render('error', {message: 'err authing???'}); 
          }
      });
    }
  
    function error(err) {
      console.log(err.message);
      res.render('register', {message: err.message ?? 'Registration error'}); 
    }
  
    // attempt to register new user
    auth.register(req.body.username, req.body.email, req.body.password, error, success);
});


  app.get('/login', (req, res) => {
      res.render('login');
  });
  
  app.post('/login', (req, res) => {
    // setup callbacks for login success and error
    function success(user) {
      auth.startAuthenticatedSession(req, user, (err) => {
        if(!err) {
          res.redirect('/'); 
        } else {
          //res.render('error', {message: 'error starting auth sess: ' + err}); 
        }
      }); 
    }
  
    function error(err) {
      res.render('login', {message: err.message || 'Login unsuccessful'}); 
    }
  
    // attempt to login
    auth.login(req.body.username, req.body.password, error, success);
  });





io.on('connection', (socket) =>{
    socket.on('startBillPaid', data =>{
        //const data = {userName, remark, total, people};
        if (data.total <= 0 || !data.total){
            socket.emit('submitFail');
        }else if (data.remark === ""){
            socket.emit('submitFail');
        }else{
            User.findOne({username: data.userName}, (err, found) =>{
                const updated = helperFn.split(found.friends, data.people, data.total);
                User.updateOne({username: data.userName}, {"$set": {"friends": updated}}, (err) =>{
                    if (err){
                        console.log(err);
                    }
                })
            })

            const peopleArr = helperFn.generatePeopleArr(data.total, data.people);
            const newBill = new Bill({
                remark:data.remark,
                total:data.total,
                user:data.total,
                people:peopleArr
            })
            newBill.save((err, saved) =>{
                if (err){
                    console.log(err);
                    socket.emit('submitFail');
                }else{
                    User.updateOne({username: data.userName}, {"$push": {"bills": saved._id}}, (err) =>{
                        if (err){
                            console.log(err);
                        }else{
                            socket.emit('submitSuccess');
                        }
                    });
                }
            })
        }
    });

    socket.on('startBillNotPaid', data =>{
        //const data = {userName, remark, payer, total, numOfPeople};
        if (data.total <= 0 || !data.total){
            socket.emit('submitFail');
        }else if (data.remark === ""){
            socket.emit('submitFail');
        }else if (data.numOfPeople <= 2){
            socket.emit('submitFail');
        }else{
            const split = data.total / data.numOfPeople;
            User.findOne({username: data.userName}, (err, found) =>{
                const updated = found.friends;
                updated.forEach(friendObj =>{
                    if (friendObj.friendName === data.payer){
                        friendObj.balance -= split;
                    }
                });
                User.updateOne({username: data.userName}, {"$set": {"friends": updated}}, (err) =>{
                    if (err){
                        console.log(err);
                    }
                })
            })
        
            const peopleArr = [{userName: data.payer, amount: data.total}, {userName: `${data.numOfPeople - 2} other friends`, amount: 0}];
            const newBill = new Bill({
                remark:data.remark,
                total:data.total,
                user:0,
                people:peopleArr
            })
            newBill.save((err, saved) =>{
                if (err){
                    console.log(err);
                    socket.emit('submitFail');
                }else{
                    User.updateOne({username: data.userName}, {"$push": {"bills": saved._id}}, (err) =>{
                        if (err){
                            console.log(err);
                        }else{
                            socket.emit('submitSuccess');
                        }
                    });
                }
            })
        }
    })
});



server.listen(process.env.PORT || 3000);
