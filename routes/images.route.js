const express = require('express')
const router = express.Router()
const uploadMulter = require('../utils/upload')
const validation = require('../middleware/validation')
const {
    createCategory
} = require('../controllers/images')

router.post("/category", uploadMulter, validation, createCategory);

module.exports = router