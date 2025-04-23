// EXPRESS
const express = require("express");
const router = express.Router({mergeParams:true});
//Review Model
const review = require("../models/review.js");
// Listing Model
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLogged, isReviewOwner, validateReview } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js")

//REVIEW route
router.post("/", isLogged, validateReview, wrapAsync(reviewController.addReview));

//DELETE REVIEW
router.delete("/:reviewId", isReviewOwner, isLogged, wrapAsync(reviewController.destroyReview));
module.exports = router;