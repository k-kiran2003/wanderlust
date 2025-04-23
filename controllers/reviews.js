// Listing Model
const Listing = require("../models/listing");
//Review Model
const review = require("../models/review.js");

module.exports.addReview=(async(req,res)=>{
    req.flash("success", "Review Added!");
    const { id } = req.params;
let list = await Listing.findById(req.params.id);
let newReview = new  review(req.body.review);
newReview.author= req.user._id;
list.review.push(newReview);
await newReview.save();
await list.save();
console.log("review saved");

    res.redirect(`/listing/${id}`);

});
module.exports.destroyReview = ( async(req,res)=>{
    req.flash("success", "Review Deleted!");
let {id,reviewId} = req.params;
await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
     await review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`);

});