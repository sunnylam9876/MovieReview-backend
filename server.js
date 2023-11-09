
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const mongoURI = process.env.mongoURI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});


// import routes
const userRouter = require('./routes/userRouter');
const reviewRouter = require('./routes/reviewRouter');
const movieRouter = require('./routes/movieRouter');

// adding routes
app.use('/user', userRouter);
app.use('/review', reviewRouter);
app.use('/movie', movieRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

//test