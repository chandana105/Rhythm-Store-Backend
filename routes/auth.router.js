const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require('../models/user.model.js');



router.route('/sign-up' )
  .post( async (req, res) => {
    try {
      const user = req.body;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt)
      user.password = hashedPassword
      const NewUser = new User(user);
      const savedUser = await NewUser.save();
      res.json({ success: true, message: "User created successfully" })
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Unable to Create new User",
        errorMessage: err.message,
      });
    }
  })



module.exports = router