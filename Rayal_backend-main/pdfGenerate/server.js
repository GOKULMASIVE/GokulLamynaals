const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
var router = express.Router();

module.exports = router;

const SERVER_URL = process.env.SERVER_URL;


router.get("/renderHtml", renderHtml);

async function renderHtml(req, res) {
  var dynamicData=req.query
  res.render(dynamicData.ejs, {dynamicData, SERVER_URL });
}

