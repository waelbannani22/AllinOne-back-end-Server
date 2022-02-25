
const express = require("express");
const router = express.Router();
const upload = require("../utils/upload");
const app = express();

app.use(express.json()) 

// Controllers
const {
  login,
  register,
  forgotPassword,
  resetPassword,
  uploadimage,
  findbyID,
  updateUser,
  passwordReset
} = require("../controllers/auth");
//routes
router.route("/register").post(register);

router.route("/login").post(login);

router.route("/forgotpassword").post(forgotPassword);

router.route("/passwordreset/:resetToken").put(resetPassword);
router.route("/uploadimage").post(upload,uploadimage);
router.post("/uploadImage",upload,uploadimage);

router.route("/findbyid").post(findbyID);
router.route("/updateUser").post(updateUser);
router.route("/resetpassword").post(passwordReset);
module.exports = router;
