const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const { upload, uploadMultiple } = require("./upload");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint for single image upload (optional)
app.post("/upload", upload, (req, res) => {
  if (req.file) {
    res.json({ imageUrl: req.file.path }); // Cloudinary URL
  } else {
    res.status(400).json({ error: "Image upload failed" });
  }
});

// Endpoint for multiple image uploads
app.post("/upload-multiple", uploadMultiple, (req, res) => {
  if (req.files && req.files.length > 0) {
    const imageUrls = req.files.map((file) => file.path); // Extract Cloudinary URLs
    res.json({ imageUrls });
  } else {
    res.status(400).json({ error: "Image upload failed" });
  }
});

// Endpoint to add data to otherinfo
app.post("/otherinfo", (req, res) => {
  const newData = req.body;

  // Read existing data from db.json
  fs.readFile("db.json", "utf-8", (err, content) => {
    if (err) return res.status(500).json({ error: "Failed to read database" });

    const db = JSON.parse(content);

    // Append new data to otherinfo array
    if (!db.otherinfo) {
      db.otherinfo = [];
    }
    db.otherinfo.push(newData);

    // Save updated data back to db.json
    fs.writeFile("db.json", JSON.stringify(db, null, 2), (writeErr) => {
      if (writeErr)
        return res.status(500).json({ error: "Failed to save data" });
      res.json({ message: "Data added successfully", data: newData });
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
