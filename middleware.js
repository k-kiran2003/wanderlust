const Listing = require("./models/listing");
const review = require("./models/review");
//JOI
const { listingSchema } = require("./schema.js");
//JOI
const { reviewSchema } = require("./schema.js");

// expressError
const expressError = require("./utils/expressError.js");

module.exports.isLogged=(req,res,next) =>{
  
    console.log(req.user);
    if (!req.isAuthenticated()) {
        req.session.redirect = req.originalUrl;
        req.flash("error", "you must be logged in to create new listing");
        return res.redirect("/login")
    }
    next();
}
module.exports.saveUrl = (req,res,next)=>{
    if (req.session.redirect){
        res.locals.redirectUrl = req.session.redirect;
    }
    next();
};
// module.exports.isOwner =async (req,res,next)=>{
//     let { id } = req.params;
//     let Listing =  await listing.findById(id);
//     if(! res.locals.currUser && res.locals.currUser.equals(Listing.owner._id)){
// res.flash("error","Access Denied");
// return res.redirect(`listing/${id}`);
//     }
//     next();
// }

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
        if (!res.locals.currUser || !listing.owner.equals(res.locals.currUser._id)) {
            req.flash("error", "Access Denied");
            return res.redirect(`/listing/${id}`);
        }

        next();
    };
module.exports.isReviewOwner = async (req, res, next) => {
    const { id, reviewId } = req.params;
    let Review = await review.findById(reviewId);
    if (!res.locals.currUser || !Review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "you are not the author of this review");
        return res.redirect(`/listing/${id}`);
    }

    next();
};
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        console.log(error);
        // let errMes =error.details.map((el) => el.message).join(",");
        throw new expressError(500, error);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        console.log(error);
        // let errMes =error.details.map((el) => el.message).join(",");
        throw new expressError(500, error);
    } else {
        next();
    }
};


