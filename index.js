// require('dotenv').config(); // This loads the .env variables
require('dotenv').config();
// console.log("MongoDB URI:", process.env.ATLAS); // 👈 TEMP LOG THIS


// EXPRESS
const express = require("express");
let app = express();
// MONGOOSE
const mongoose = require("mongoose");
// Listing Model
const Listing = require("./models/listing");
const wrapAsync = require("./utils/wrapAsync.js");
// PATH
const path = require("path");
// expressError
const expressError = require("./utils/expressError.js");
// METHOD-OVERRIDE
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
//router
const listing  = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js")
const userRouter = require("./routes/user.js");
// EJS-MATE
const ejsMate = require("ejs-mate");
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
//SESSION
const session = require("express-session");
const MongoStore = require('connect-mongo');
//authentication
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
//FLASH
const flash = require("connect-flash");
const { error } = require('console');
app.use(flash());
// Set views and public directory
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Mongoose Connection
// let DB_URL = "mongodb://127.0.0.1:27017/wonderlust";
let atlasDB = process.env.ATLAS;
main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log("DB Connection Error:", err);
});
async function main() {
    await mongoose.connect(atlasDB);
}
const store = MongoStore.create({
    mongoUrl : atlasDB,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter : 24 *3600,
});
store.on("error",()=>{
    console.log("MONGO STORE ERROR",error);
})
//session
const sessionOptions = {
    store,
    secret: process.env.SECRET,
      resave: false,
      saveUninitialized:true,
     Cookie:{
        expires: Date.now() + 7*24 * 60 *60 * 1000,
         maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true
     }
    };

app.use(session(sessionOptions));

//PASSPORT
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
  
   
    console.log("Current User:", req.user); 
    next();
});
// app.get("/demo",async(req,res)=>{
//     let newUser = new User({
//         email: "demo@gmai.com",
//         username : "demouser"
//     });
//     let registeredUser = await User.register(newUser,"password");
//     console.log(registeredUser);
//     res.send("created");
// });

//routes

app.use("/listing",listing);
app.use("/listing/:id/review",reviewRoute);
app.use("/",userRouter);
// Sample Route to Insert Dummy Data
app.get("/testing", wrapAsync(async (req, res) => {
    let sampleData = new Listing({
        title: "Raddisson",
        description: "Hotel",
        location: "Amritsar, Punjab",
        country: "India"
    });
    await sampleData.save();
    console.log("Sample saved");
    res.send("Sample listing added");
}));

app.all(/.*/,(req,res,next)=>{
    next(new expressError(404,"page not found"));
})
// Error handling middleware
app.use((err, req, res, next) => {
    let { status = 400, message = "Something went wrong" } = err;
    res.status(status).render("listings/error",{err});
   
});


// Start Server
app.listen(8080, () => {
    console.log("App is listening on port 8080");
});
