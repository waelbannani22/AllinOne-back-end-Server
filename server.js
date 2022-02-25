require("dotenv").config({ path: "./config.env" });
const mongoose = require('mongoose')
const express = require("express");
const app = express();
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
var cors = require('cors')

app.use(cors())

mongoose.connect('mongodb+srv://allin:123@allin.wfzye.mongodb.net/allin?retryWrites=true&w=majority',
{useNewUrlParser: true,
useFindAndModify: false,
useCreateIndex: true,
useUnifiedTopology: true}
)
const db = mongoose.connection

db.on('error', (err) => {
  console.log(err)

})
db.once('open', () => {
  console.log('database connection established!')


});

app.use(express.json());

app.get("/", (req, res, next) => {
  res.send("Api running");
});
app.use(express.static('./public'));
app.use('/uploads', express.static('uploads'));

// Connecting Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/", require("./routes/private"));
app.use('/api/images', require('./routes/images.route'));
app.use('/admin/', require('./routes/admin-routes'));
app.use('/admin/class', require('./routes/class-routes'));
// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Sever running on port ${PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err.message}`);
  server.close(() => process.exit(1));
});
