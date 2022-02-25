const express = require("express");
const router = express.Router();
const upload = require("../utils/upload");
const app = express();

app.use(express.json()) 

const {
    
    createClass,
    assignStudentToClass
  } = require("../controllers/classControlller");
  //routes
  router.route("/createclass").post(createClass);
  router.route("/assign").post(assignStudentToClass);
  
  
  
  module.exports = router;