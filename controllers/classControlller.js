const crypto = require("crypto");
const express = require('express');
const bcrypt = require("bcryptjs");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const upload = require("../utils/upload");
const admin = require("../models/admin");
const Classe = require("../models/Classe");
const app = express();

app.use(express.json())

exports.assignStudentToClass = async (req, res, next) => {
    const {idClasse,idUser} = req.body;
    var x = 0; 
    try {
     
      const student = await User.find({
        
        _id : idUser,
        
      });
      //console.log(student)
      const classes = await Classe.find({
        
        _id : idClasse,
        members : {$in : Array(student)}
        
      });
      console.log(classes)
      var x =classes
      console.log(x.length);
    
      if (x== 0)
      {
        const clas = await Classe.findOne({
        
            _id : idClasse,
           
            
          });
        if (clas.members == []){
            clas.members = (student)
        }else{
            clas.members.push(student)
        }
        
        await clas.save();
        
        console.log("success")
        res.status(200).json({
          success: true,
          data: clas,
        });
      }
      else if (x!=0)
      {
        return next(new ErrorResponse("user already added to this class", 401));

      }
   
    
    
      
     
    } catch (err) {
      console.log("failure")
      next(err);
    }
  };
  exports.createClass = async (req, res, next) => {
    const {className} = req.body;
    try {
     
      const classe = await Classe.create({
        
        className : className,
        members : []
        
      });
      console.log("success")
      res.status(200).json({
        success: true,
        data: classe,
      });
    } catch (err) {
      console.log("failure")
      next(err);
    }
  };