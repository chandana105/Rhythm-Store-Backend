const mongoose = require("mongoose");
const mySecret = process.env['MONGO_URI']


const initializeDBConnection = async () => {
  try {
    await mongoose.connect(mySecret, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("mongodb successfully connected");
  } catch (err) {
    console.error("mongoose connection failed", err);
  }
};

module.exports = { initializeDBConnection };
