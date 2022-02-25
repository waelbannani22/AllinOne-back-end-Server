const express = require("express");
const router = express.Router();
const upload = require("../utils/upload");
const app = express();

app.use(express.json()) 

const {
    login,
    register,
    FetchTeacher
    
  } = require("../controllers/adminauth");
  //routes
  router.route("/register").post(register);
  
  router.route("/login").post(login);
  router.route("/fetchteacher").get(FetchTeacher);
  
  module.exports = router;