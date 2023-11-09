const mongoose = require("mongoose");

// define Schema Class
const Schema = mongoose.Schema;

// Create a Schema object
const reviewSchema = new Schema({
  userId: { type: String, required: true },
  tmdbId: { type: String, required: true },
  reviewBody: { type: String, required: true },
  rating: { type: Number, required: true },
  createdDate: { type: Date, default: Date.now },
  upvotes: { type: [String] }, default: [], // Array of user IDs who upvoted
  downvotes: { type: [String], default: [] } // Array of user IDs who downvoted
});

const Review = mongoose.model("review", reviewSchema);
module.exports = Review;