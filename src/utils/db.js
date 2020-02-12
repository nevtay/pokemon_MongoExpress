/* eslint-disable no-undef */
const mongoose = require("mongoose")

const mongoOptions = {
  useNewUrlParser: true, // prevent deprecation warnings
  useUnifiedTopology: true,
  useCreateIndex: true, // for creating index with unique
}

const dbName = "labPokedex"
const dbUrl = process.env.MONGO_URI || "mongodb://localhost:27017/" + dbName; 
mongoose.connect(dbUrl, mongoOptions);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"))
db.once("open", () => {
  console.log("connected")
})

