const express = require("express");
const ErrorHandler = require("./middleware/error")
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const rfs = require("rotating-file-stream");
const logger = require('morgan');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

app.use(express.json());
app.use(logger('dev'));
app.use(cookieParser());
app.use(cors({
  origin: "*",
  credentials: true,
}));
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));
app.use("/", (req, res) => {
  res.send("hello world")
});
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}


// logs 
// function getLogFileTimestamp() {
//   const currentDate = new Date();
//   const year = currentDate.getFullYear();
//   const month = String(currentDate.getMonth() + 1).padStart(2, '0');
//   const day = String(currentDate.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
// }

// const logDirectory = path.join(__dirname, './logs');
// fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// const logStream = rfs.createStream(getLogFileTimestamp() + '.log', {
//   interval: '1d',
//   path: logDirectory,
// });

// app.use(
//   morgan((tokens, req, res) => {
//     return JSON.stringify({
//       timestamp: tokens.date(req, res, 'iso'),
//       method: tokens.method(req, res),
//       url: tokens.url(req, res),
//       status: tokens.status(req, res),
//       responseTime: tokens['response-time'](req, res),
//       response: {
//         status: res.statusCode,
//         body: JSON.stringify(res.body),
//       },
//     });
//   }, { stream: logStream })
// );
// 

//import routes 
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const event = require("./controller/event");
const coupon = require("./controller/coupounCode");
const payment = require("./controller/payment");
const order = require("./controller/order");
const conversation = require("./controller/conversation");
const message = require("./controller/message");
const withdraw = require("./controller/withdraw");

app.use("/api/v2/user", user);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/payment", payment);
app.use("/api/v2/order", order);
app.use("/api/v2/conversation", conversation);
app.use("/api/v2/message", message);
app.use("/api/v2/withdraw", withdraw);

// it's for ErrorHandling
app.use(ErrorHandler);

module.exports = app;