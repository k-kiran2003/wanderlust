if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

// EXPRESS
const express = require("express");
const router = express.Router();
// wrapAsync
const wrapAsync = require("../utils/wrapAsync.js");
// Listing Model
const Listing = require("../models/listing");
const { isLogged, isOwner, validateListing } = require("../middleware.js");
//controller
const listingController = require("../controllers/listings.js");
const multer = require('multer')
const {storage} =require("../cloudConfig.js")
const upload = multer({ storage })


// Add New Listing Form
router.get("/new", isLogged, listingController.newForm);


router.route("/")
    .get(wrapAsync(listingController.index)) //all listing
    .post(isLogged,
       
         upload.single('listing[image]'),
        validateListing,
         wrapAsync(listingController.addNewListing));  //add new listing
         
//     .post(upload.single('listing[image]'), (req,res)=>{
//     res.send(req.file);
// });
//search
router.get("/category", listingController.category);
router.get("/search", listingController.categoryListing);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing)) //single listing
    .put(isLogged, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing)) //update
    .delete(isLogged, isOwner, wrapAsync(listingController.destroyListing));  //delete


// Edit Listing Form
router.get("/:id/edit", isLogged, isOwner, wrapAsync(listingController.editForm));



module.exports = router;


