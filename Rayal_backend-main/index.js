const Express = require("express");
const app = new Express();
const cors = require("cors");
const https = require("https");
const fs = require("fs");
require("dotenv").config();
const { spawn } = require("child_process");
var mongoose = require("mongoose");

var bodyParser = require("body-parser");
var path = require("path");

const mainRoute = require("./Routes/routes");
const motorRoute = require("./Routes/motorRoutes");
const { MONGODB_URI } = require("./configuration/constants");

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// app.use(cors({
//     origin: '*'
// }))

const options = {
  key: fs.readFileSync("./cert/key.pem"),
  cert: fs.readFileSync("./cert/cert.pem"),
};

app.use(cors());

app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));

// app.get("/", (req, res) => {
//     res.json({ message: "Backend is running... Fine" });
// });
app.use("/quote/calculateQuote", require("./pdfGenerate/server"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "pdfGenerate/views"));
app.use(Express.static(path.resolve(__dirname, "pdfGenerate/assets")));

app.use("/api", mainRoute);
app.use("/motor/api", motorRoute);

// var httpsServer = https.createServer(options, app);

// added by gokul...

app.use((error, req, res,next) => {
  console.error(error);
  res
    .status(200)
    .send({ error: true, data: {}, message: "Something went wrong!!!" });
});

app.listen(3000, (error) => {
  if (!error) {
    console.log(`Server is running on port: ${3000}!`); // eslint-disable-line
  }
});
