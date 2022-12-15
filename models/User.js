const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const res = require("express/lib/response");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
    },
    tokens: [{
      token:{
        type: String,
      required: true
      }
    }]
  },
  { timestamps: true }
);

UserSchema.methods.generateAuthToken = async function(){
   try{
      const token = jwt.sign({_id:this._id.toString()},"mynameishimanshunareshbulaniabcd");
      console.log(token);
      this.tokens = this.tokens.concat({token:token})
      return token;
   }catch(error){
res.send("the error part");
console.log(error);
   }
}

module.exports = mongoose.model("User", UserSchema);