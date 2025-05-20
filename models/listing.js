const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review.js");
const { reviewSchema } = require("../schema");
const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1741851374430-d242e0dcd70c?q=80&...",
            set: (v) => v === ""
                ? "https://images.unsplash.com/photo-1741851374430-d242e0dcd70c?q=80&..."
                : v,
        },
        filename: {
            type: String
        }
    }
,
    price: {
        type:Number,
        default:0
    },
    location: String,
    country: String,
    review:[
       {
        type: Schema.Types.ObjectId,
        ref:"review",
       },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref :"User",
    },
    category :{
        type:String,
        enum: ["Trending","Mountain-city", "Mountain", "Castle", "Pools",
            "Camping", "Farms", "Arctic", "Boats", "Camper Vans"
],
    },

});

listingSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        // Deletes all reviews where _id is in doc.reviews array
        await review.deleteMany({ _id: { $in: doc.review } });
    }
});
const listing = mongoose.model("listing",listingSchema);
module.exports = listing;