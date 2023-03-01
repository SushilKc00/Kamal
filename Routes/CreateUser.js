const express = require("express");

const router = express.Router();

const User = require("../Model/User.js");
const { body, validationResult } = require("express-validator");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const jwtsec = "nfdmnsdfnjkdfjmdfnndfjngkff32132";

router.post(
  "/createuser",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
    body("name").isLength({ min: 3 }),
  ],
  async (req, res) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    //const salt =  await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    //console.log(newPassword)
    try {
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
        location: req.body.location,
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.log(error);
      res.status(400).json({ success: false });
    }
  }
);

router.post(
  "/loginuser",
  [body("email").isEmail(), body("password").isLength({ min: 5 })],
  async (req, res) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    let email = req.body.email;
    try {
      let userData = await User.findOne({ email });
      if (!userData) {
        return res.status(400).json({ msg: "email not found" });
      }
      const passcomp = await bcrypt.compare(
        req.body.password,
        userData.password
      );

      if (!passcomp) {
        return res.status(400).json({ msg: "wrong password" });
      }

      const data = {
        user: {
          id: userData.id,
        },
      };
      const authToken = jwt.sign(data, jwtsec);
      return res.status(200).json({ success: true, authToken: authToken });
    } catch (error) {
      console.log(error);
      return req.status(400).json({ success: false });
    }
  }
);
module.exports = router;
