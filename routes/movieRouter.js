const router = require("express").Router();
const objModel = require("../models/tmdbMovieModel");
const axios = require("axios");
require('dotenv').config();

// ---------------------------------------------------------
// Get from tmdb and save to local db  (currently get 200 movies from tmdb)
// ---------------------------------------------------------
router.get('/get-from-tmdb-to-local', async (req, res) => {
    try {
      const tmdbMovieListURI = process.env.TMDBMovieListURI;

      // Fetch data from the API using axios
      let response = await axios.get(tmdbMovieListURI);
      let apiData = response.data.results;
  
      await objModel.deleteMany({});

      // Save the fetched data to MongoDB using Mongoose
      const savedData = await objModel.create(apiData);

      const fetchLoopCount = 9;
      
      for(i=0; i< fetchLoopCount; i++){

        // Fetch data from the API using axios
            uri = tmdbMovieListURI.substring(0, tmdbMovieListURI.length -1) + (i+2);
            //console.log(uri + (i+2));
            response = await axios.get(uri);
            apiData = response.data.results;
            await objModel.insertMany(apiData);
        
      }
      
      // return
      return res.status(200).json({ data: 'OK' });
      
    } catch (error) {
      console.error('Error fetching data from the API and saving to MongoDB:', error);
      res.status(500).json({ error: 'Failed to fetch and save data' });
    }
  });

// ---------------------------------------------------------
// List all 
// ---------------------------------------------------------
router.route("/getall").get((req, res) => {
   
    console.log("*** List all: ");
  
    // Check object
    objModel.find({ }, (err, objs) => {
      if (err) {
          console.error('Error finding info:', err);
          return res.status(400).json({ error: 'Error' });
      } 
      else {
          if(objs.length > 0){
            return res.status(200).json(objs);
        }
          else{
              return res.status(400).json({ error: 'Data not found' });
          }
      }
    });
  
});


module.exports = router;
