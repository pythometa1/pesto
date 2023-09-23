import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mysql2 from "mysql2";
import { sendSMS } from "./Otp.js";

const app = express();

app.use(cors());

const db = mysql2.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "pestokiller",
});

//Fetching data from backend
app.get("/getData", (req, res) => {
  // Perform a SQL query to fetch data from the database
  const query = "SELECT * FROM maincontact, contact";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error executing SQL query: ", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(results);
  });
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// API endpoint to handle form submissions
app.post("/api/submit", (req, res) => {
  const { name, number, selectedService, address } = req.body;

  // Insert data into MySQL database
  const query =
    "INSERT INTO maincontact (name, number, service, address) VALUES (?,?,?,?)";
  db.query(
    query,
    [name, number, selectedService, address],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: "Error inserting data" });
      } else {
        console.log("Data inserted successfully:", req.body);
        res.json({ message: "Data inserted successfully" });
        var mobileNumber = number;
        sendSMS(mobileNumber, selectedService);
      }
    }
  );
});

//for big contact form
app.post("/api/contact", (req, res) => {
  const { name, email, telephone, postcode, pests } = req.body;

  // Insert data into MySQL database
  const query =
    "INSERT INTO contact (name, email, telephone, postcode, pests) VALUES (?,?,?,?,?)";
  db.query(
    query,
    [name, email, telephone, postcode, pests],
    (error, results) => {
      if (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ message: "Error inserting data" });
      } else {
        console.log("Data inserted successfully:", req.body);
        res.json({ message: "Data inserted successfully" });
        var mobileNumber = telephone;
        var selectedService = pests;
        sendSMS(mobileNumber, selectedService);
      }
    }
  );
});

app.listen(5000, () => {
  console.log("App is running");
});
