require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { connectToDB } = require("./config/database/mongodb");
const router = require("./route");
const { convertExcelToBase64 } = require("./utils");

const PORT = process.env.PORT || 4000;
const app = express();

const corsOptions = {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Custom headers allowed
  credentials: true, // Allow credentials like cookies or authentication headers
  optionsSuccessStatus: 200, // Some legacy browsers choke on status 204 for OPTIONS
};

app.use(express.json({ extended: true }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: false }));
app.use(cors(corsOptions));

app.use("/api/certificate", router);

app.get("/", (req, res) => res.send("Server is up and running!!!"));

console.log(process.env.CLOUDINARY_CLOUD_NAME
,process.env.CLOUDINARY_API_KEY
,process.env.CLOUDINARY_API_SECRET);

const startApp = async () => {
  await connectToDB();
  app.listen(PORT, () => console.log(`server is running on port:${PORT}`));
};

startApp();
