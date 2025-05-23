const Joi = require('joi');
const listing = require('./models/listing');
const review = require('./models/review');

module.exports.listingSchema = Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        image: Joi.string().allow("",null),
        category: Joi.string().required(),
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating :Joi.number().min(1).max(5),
        comment:Joi.string().required(),
    }).required(),
})