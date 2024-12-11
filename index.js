require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { connectToDB } = require("./config/database/mongodb");
const router = require("./route");
const { convertExcelToBase64 } = require("./utils");
const path =  require('path')
const PORT = process.env.PORT || 4000;
const app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

const corsOptions = {
  origin: ["http://localhost:5173/", "http://127.0.0.1:5500/"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Custom headers allowed
  exposedHeaders: ["Content-Disposition"],
  credentials: true, // Allow credentials like cookies or authentication headers
  optionsSuccessStatus: 200, // Some legacy browsers choke on status 204 for OPTIONS
};

app.use(express.json({ extended: true }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: false }));
app.use(cors(corsOptions));

app.use("/api/certificate", router);

app.get("/", (req, res) => res.send("Server is up and running!!!"));

const startApp = async () => {
  await connectToDB();
  app.listen(PORT, () =>
    console.log(`server is running on http://localhost:${PORT}`)
  );
};

startApp();
