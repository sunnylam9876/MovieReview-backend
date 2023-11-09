const router = require("express").Router();
const objModel = require("../models/reviewModel");
const mongoose = require('mongoose');


// ---------------------------------------------------------
// List all 
// ---------------------------------------------------------
router.route("/getall").get((req, res) => {

    console.log("*** List all: ");

    // Check object
    objModel.find({}, (err, users) => {
        if (err) {
            console.error('Error finding info:', err);
            return res.status(400).json({ error: 'Error' });
        }
        else {
            if (users.length > 0) {
                return res.status(200).json(users);
            }
            else {
                return res.status(400).json({ error: 'Data not found' });
            }
        }
    });

});

// ---------------------------------------------------------
// Add object
// ---------------------------------------------------------
router.route("/add").post((req, res) => {
    const userId = req.body.userId;
    const tmdbId = req.body.tmdbId;
    const reviewBody = req.body.reviewBody;
    const rating = req.body.rating;

    // create a new object 
    const newObj = new objModel({
        userId,
        tmdbId,
        reviewBody,
        rating
    });

    console.log("*** Add review: " + userId + ", tmdbID:" + tmdbId);

    // save the new object
    newObj
        .save()
        .then((savedObj) => res.json(savedObj))
        .catch((err) => res.status(400).json("Error: " + err));

});

// ---------------------------------------------------------
// Get Review by user Id
// ---------------------------------------------------------
router.route("/getreviewbyuserid/:id").get((req, res) => {
    const userId = req.params.id;

    console.log("*** Get Review: " + userId);

    // Check object
    objModel.find({ userId: userId }, (err, objs) => {
        if (err) {
            console.error('Error finding info:', err);
            return res.status(400).json({ error: 'Error' });
        }
        else {
            if (objs.length > 0) {
                return res.status(200).json(objs);
            }
            else {
                return res.status(400).json({ error: 'Data not found' });
            }
        }
    });

});
// ---------------------------------------------------------
// Get Review by movie Id
// ---------------------------------------------------------
router.route("/getreviewbymovieid/:id").get((req, res) => {
    const tmdbId = req.params.id;

    console.log("*** Get Review: tmdbId: " + tmdbId);

    // Check object
    objModel.find({ tmdbId: tmdbId }, (err, objs) => {
        if (err) {
            console.error('Error finding info:', err);
            return res.status(400).json({ error: 'Error' });
        }
        else {
            if (objs.length > 0) {
                return res.status(200).json(objs);
            }
            else {
                return res.status(400).json({ error: 'Data not found' });
            }
        }
    });

});

// ---------------------------------------------------------
// Update Review by Id
// ---------------------------------------------------------
router.route("/update").post((req, res) => {
    const reviewId = req.body.reviewId;
    const reviewBody = req.body.reviewBody;
    const rating = req.body.rating;
    const objectId = mongoose.Types.ObjectId(reviewId);

    console.log("*** Update review: " + reviewId);

    // console.log(mongoose.isValidObjectId(reviewId));
    // console.log(mongoose.isValidObjectId(objectId));

    // Check object
    objModel.findById(objectId, (err, obj) => {
        if (err) {
            console.error('Error finding info:', err);
            return res.status(400).json({ error: 'Error' });
        }
        else {
            if (obj) {
                obj.reviewBody = reviewBody;
                obj.rating = rating;

                obj.save()
                    .then((savedObj) => res.status(200).json(savedObj))
                    .catch((err) => res.status(400).json("Error: " + err));
                //return res.status(200).json(obj);
            }
            else {
                return res.status(400).json({ error: 'Data not found' });
            }
        }
    });
});

// ---------------------------------------------------------
// Delete Review by Id
// ---------------------------------------------------------
router.route("/delete").post((req, res) => {
    const reviewId = req.body.reviewId;
    const objectId = mongoose.Types.ObjectId(reviewId);

    console.log("*** Delete review: " + reviewId);

    // console.log(mongoose.isValidObjectId(reviewId));
    // console.log(mongoose.isValidObjectId(objectId));

    // Check object
    objModel.findById(objectId, (err, obj) => {
        if (err) {
            console.error('Error finding info:', err);
            return res.status(400).json({ error: 'Error' });
        }
        else {
            if (obj) {
                obj.delete()
                    .then((savedObj) => res.status(200).json(savedObj))
                    .catch((err) => res.status(400).json("Error: " + err));
                //return res.status(200).json(obj);
            }
            else {
                return res.status(400).json({ error: 'Data not found' });
            }
        }
    });
});

// Upvote a review
router.post("/upvote/:reviewId", async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.body.userId;

    try {
        const review = await objModel.findById(reviewId);
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        // Check if the user has already upvoted
        if (review.upvotes.includes(userId)) {
            review.upvotes.pull(userId);
        } else {
            // Remove user from downvotes (if exists) and add to upvotes
            review.downvotes.pull(userId);
            review.upvotes.push(userId);
        }
        await review.save();
        res.status(200).json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Downvote  a review
router.post("/downvote/:reviewId", async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.body.userId;

    try {
        const review = await objModel.findById(reviewId);
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        // Check if the user has already downvoted
        if (review.downvotes.includes(userId)) {
            review.downvotes.pull(userId);
        } else {
            // Remove user from upvotes (if exists) and add to downvotes
            review.upvotes.pull(userId);
            review.downvotes.push(userId);
        }
        await review.save();
        res.status(200).json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});


module.exports = router;
