const express=require("express");
const AuthController=require("../contollers/authController");
const router=express.Router();

router.post("/register",AuthController.register);
router.post("/login",AuthController.login);

module.exports=router;
