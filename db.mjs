import mongoose from 'mongoose';
import mongooseSlugPlugin from 'mongoose-slug-plugin';



// //this is a list of people sharing a bill
// const PersonSchema = new mongoose.Schema({
//     userName: {type: String, required: true},
//     amount: {type: Number, default: 0, required: false}
// });

//this is a bill
const BillSchema = new mongoose.Schema({
    remark: {type: String, required: true},
    // time: {type: String, required: true},
    total: {type: Number, required: true},
    user: {type: Number, default: 0, required: false}, //The amount the user paid
    people: [{userName: String, amount: Number}], //what other people paid
    // closed: {type: Boolean, default: false, required: false},
},{
    _id: true
});


//this is a friend
// const FriendSchema = new mongoose.Schema({
//     name: {type: String, required: true},
//     balance: {type: Number, dafault: 0, required: false}
//   }, {
//     _id: true
//   });


const UserSchema = new mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  friends:  [{friendName: String, balance: Number}],
  bills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bill' }]
});


BillSchema.plugin(mongooseSlugPlugin, {tmpl: '<%=remark%>'});
// mongoose.model("Friend", FriendSchema);
mongoose.model("Bill", BillSchema);
mongoose.model("User", UserSchema);
// mongoose.model("Person", PersonSchema);


// is the environment variable, NODE_ENV, set to PRODUCTION? 
import fs from 'fs';
import path from 'path';
import url from 'url';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/split';
}

mongoose.connect(dbconf);
