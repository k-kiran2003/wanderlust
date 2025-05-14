const Listing = require("../models/listing");

module.exports.index = (async (req, res) => {
    const listingdata = await Listing.find({});
    res.render("listings/index", { listingdata });
});

//new form 
module.exports.newForm = (req, res) => {

    res.render("listings/add");
};

//adding new listing
module.exports.addNewListing = (async (req, res, next) => {
let url = req.file.path;
let filename = req.file.filename;
console.log(url , "----" , filename);

    let listing = req.body.listing;
    let newData = new Listing(listing);
    newData.owner = req.user._id;
    newData.image = {url,filename}
    await newData.save();
    req.flash("success", "New Listing Added");
    console.log("Listing added:", listing);
    res.redirect("/listing");
});
//show single listing
module.exports.showListing=  (async (req, res) => {
    const { id } = req.params;
    const data = await Listing.findById(id).populate( {path:"review",
       populate:{
            path:"author",
        }}
    ).populate("owner").populate("category");
    if (!data) {
        req.flash("error", "The requested Listing doesn't exists");
        res.redirect("/listing");

    }else{
        // console.log(data);
        res.render("listings/show", { data });
        console.log(data);
    }

});
//edit form 
module.exports.editForm = (async (req, res) => {
 
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "The requested Listing doesn't exists");
        res.redirect("/listing");
    }else{
        let originameImageUrl = listing.image.url;
        console.log("Transformed URL:", originameImageUrl);

        originameImageUrl = originameImageUrl.replace("/upload", "/upload/ar_1.0,c_fill,h_250");

        res.render("listings/edit", { listing ,originameImageUrl});
    }

     
});
//update listing
module.exports.updateListing = (async (req, res) => {
    req.flash("success", "Listing Updated!");
    let { id } = req.params;
   let listing=  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if( typeof (req.file)!== "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      listing.save();
  }
  
    res.redirect(`/listing/${id}`);
});
//delete 
module.exports.destroyListing = (async (req, res) => {
    req.flash("success", "Listing Deleted !");
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
});
//search
module.exports.category = async (req, res) => {
    try {
        const { category } = req.query;

        const allowedCategories = [
            "Mountain-city", "Mountain", "Castle", "Pools",
            "Camping", "Farms", "Arctic", "Boats", "Camper Vans"
        ];
        if (!allowedCategories.includes(category)) {
            req.flash("error", "Invalid category");
            return res.redirect("/listing");
        }

        const listings = await Listing.find({ category });
        res.render("listings/category", { listings, category });
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong");
        res.redirect("/listing");
    }
};