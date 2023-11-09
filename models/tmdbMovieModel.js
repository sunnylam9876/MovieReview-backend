const mongoose = require("mongoose");

// define Schema Class
const Schema = mongoose.Schema;

const todoSchema = new mongoose.Schema({
    adult: { type: Boolean, required: true },
    backdrop_path: { type: String, required: false },
    genre_ids: { type: [Number], required: false },
    id: { type: Number, required: true },
    original_language: { type: String, required: false },
    original_title: { type: String, required: false },
    overview: { type: String, required: false },
    popularity: { type: Number, required: false },
    poster_path: { type: String, required: false },
    release_date: { type: String, required: false },
    title: { type: String, required: false },
    video: { type: Boolean, required: false },
    vote_average: { type: Number, required: false },
    vote_count: { type: Number, required: false },
  });

const Movie = mongoose.model("movie", todoSchema);
module.exports = Movie;