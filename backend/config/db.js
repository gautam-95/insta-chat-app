const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Mongo DB connected: ${connection.connection.host}`);
  } catch (err) {
    console.error(`Error while connecting to the database: ${err.message}`);
    process.exit();
  }
};

module.exports = connectDB;