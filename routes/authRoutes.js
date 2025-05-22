const express = require("express");
const router = express.Router();
const { register, login, deleteAccount } = require("../controllers/authController");
const auth = require('../middlewares/authMiddleware');

router.post("/register", register);
router.post("/login", login);

router.delete('/delete', auth, deleteAccount); 


module.exports = router;
