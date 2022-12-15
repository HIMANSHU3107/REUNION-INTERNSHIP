const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv");
const userRoutes = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require("./routes/posts");
const jwt = require("jsonwebtoken");

const PORT = process.env.PORT || 8800;
dotenv.config();
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL,()=>{
    console.log("connected to mongo");
});
// mongoose.connect(process.env.MONGO_URL)
// .then(()=>console.log('connected'))
// .catch(e=>console.log(e));


//middleware 
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users",userRoutes)
app.use("/api/auth",authRoute)
app.use("/api/posts", postRoute);

var server = app.listen(PORT,()=>{
    console.log("Backend server is running");
})

module.exports = server