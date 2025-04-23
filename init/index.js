//MONGOOSE
const mongoose = require("mongoose");

const initData = require("./data.js");
const Listing = require("../models/listing.js");
const data = require("./data.js");
let DB_URL =  "mongodb://127.0.0.1:27017/wonderlust";
main().then((res)=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log("error:",err);
})
async function main() {
   await mongoose.connect(DB_URL);
};
const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((Object) => ({ ...Object, owner: '68022f3168872ae91124b5cf'}));
Listing.insertMany(initData.data);
}
initDB();