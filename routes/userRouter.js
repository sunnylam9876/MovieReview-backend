const router = require("express").Router();
const objModel = require("../models/userModel");
const bcryptjs = require('bcryptjs');


// ---------------------------------------------------------
// List all 
// ---------------------------------------------------------
router.route("/getall").get((req, res) => {
   
    console.log("*** List all: ");
  
    // Check object
    objModel.find({ }, (err, users) => {
      if (err) {
          console.error('Error finding info:', err);
          return res.status(400).json({ error: 'Error' });
      } 
      else {
          if(users.length > 0){
            return res.status(200).json(users);
        }
          else{
              return res.status(400).json({ error: 'User not found' });
          }
      }
    });
  
});

// ---------------------------------------------------------
// Add object
// ---------------------------------------------------------
router.route("/add").post((req, res) => {
  const userId = req.body.userId;
  const password = req.body.password;
  const hashPassword =  bcryptjs.hashSync(password,10);

  // create a new object 
  const newObj = new objModel({
    userId,
    password: hashPassword    
  });

  console.log("*** Add: " + userId);

  // Check object
  objModel.find({ userId: userId }, (err, users) => {
    if (err) {
    //   res.status(400).json("Error: " + err);
    //   return;
        console.error('Error finding info:', err);
        return res.status(400).json({ error: 'Error finding info' });
    } else {
        if(users.length > 0){
            // console.log(users);
            // res.status(400).json("User Exists"); 
            // return;
            return res.status(400).json({ error: 'User exists' });
        }
        else{
            // save the new object
            newObj
                .save()
                .then((savedObj) => res.json(savedObj))
                .catch((err) => res.status(400).json("Error: " + err));
        }
    }
  });

});

// ---------------------------------------------------------
// Login : Get object
// ---------------------------------------------------------
router.route("/login").post((req, res) => {
    const userId = req.body.userId;
    const password = req.body.password;
   
    console.log("*** Login: " + userId + "," + password);
  
    // Check object
    objModel.find({ userId: userId }, (err, users) => {
      if (err) {
          console.error('Error finding info:', err);
          return res.status(400).json({ error: 'Error' });
      } 
      else {
          if(users.length > 0){
            const authenticated = bcryptjs.compareSync(password, users[0].password);
            if (authenticated){
                return res.status(200).json(users);
            }
            else{
                return res.status(400).json({error: 'password error'});
            }
          }
          else{
              return res.status(400).json({ error: 'User not found' });
          }
      }
    });
  
});

// ---------------------------------------------------------
// Update object
// ---------------------------------------------------------
router.route("/update").post((req, res) => {
    const userId = req.body.userId;
    const password = req.body.password;
   
    console.log("*** Update: " + userId);
  
    // Check object
    objModel.findOne({ userId: userId }, (err, obj) => {
      if (err) {
          console.error('Error finding info:', err);
          return res.status(400).json({ error: 'Error' });
      } 
      else {
          if(obj != null && obj.userId.length > 0){

                obj.password = bcryptjs.hashSync(password,10);
                obj.save();
                return res.status(200).json(obj);
          }
          else{
              return res.status(400).json({ error: 'User not found' });
          }
      }
    });
});

module.exports = router;
