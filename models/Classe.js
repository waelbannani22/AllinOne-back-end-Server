const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./User");

const ClasseSchema = new mongoose.Schema({
  className: {
    type: String,
    required: [true, "Please provide firstname"],
  },
  members:{
      type:Array,
      required: false,
      unique : true,
      
      
      
  } 
    
});


const Classe = mongoose.model("Classe", ClasseSchema);

module.exports = Classe;
