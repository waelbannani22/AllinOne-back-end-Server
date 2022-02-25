const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
    
    fullname: {
        type: String,
        
        required: true
    },
    role: {
        type: String,
        
        required: true
    },
    password: {
        type: String,
        
        required: true
    }
}, {
    timestamps: true
});
adminSchema.methods.matchPassword = async function (password) {
    if (password == this.password){
        return await true
    }
    return await false;
    
  };

module.exports = mongoose.model('Admin', adminSchema);