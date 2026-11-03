const express = require("express");
const userEditRouter = express.Router();

const { updateName } = require("../controllers/userEditController");

const isAuth = require("../middlewares/isAuth");

userEditRouter.patch("/name", isAuth, updateName);

module.exports = userEditRouter;