const mongoose = require('mongoose');
const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URL, {});
    console.log("MongoDB Connected");
    console.error("Error connecting to Mongodb");
    process.exit(1);
}
module.exports = connectDB;