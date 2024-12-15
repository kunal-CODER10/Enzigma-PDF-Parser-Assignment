const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const Tesseract = require("tesseract.js");
const path = require("path");
const Candidate = require('./model/Candidate');
const fs = require('fs');
const sharp = require("sharp");

require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// File Upload Endpoint
app.post("/upload", upload.array("files"), async (req, res) => {
    const results = [];
    for (const file of req.files) {
        try {
            // Preprocess image (if needed) and extract text
            const processedPath = await preprocessImage(file.path);
            const text = await extractTextFromImage(processedPath);

            // Parse extracted text
            const parsedData = parseFormData(text);
            
            // Save to database
            const candidate = new Candidate({
                ...parsedData,
                formPath: file.path,
            });
            await candidate.save();
            results.push(candidate);

            // Clean up temporary files
            fs.unlinkSync(file.path);
            fs.unlinkSync(processedPath);
        } catch (err) {
            console.error("Error processing file:", file.path, err.message);
            return res.status(500).json({ error: "Error processing file", details: err.message });
        }
    }
    res.json(results);
});

// Fetch All Records
app.get('/records', async (req, res) => {
    const query = req.query.name || ''; 
    try {
        const records = await Candidate.find({
            name: { $regex: query, $options: 'i' } 
        });
        res.json(records);
    } catch (err) {
        res.status(500).send("Error fetching records");
    }
});

// Fetch Single Record by ID
app.get('/recordInside/:id', async(req, res) => {
    const id = req.params.id;
    try {
        const record = await Candidate.findById(id);
        res.json(record);
    } catch (err) {
        res.status(500).send("Error fetching record");
    }
});

app.delete('/records/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedRecord = await Candidate.findByIdAndDelete(id);
        if (!deletedRecord) {
            return res.status(404).json({ error: "Record not found" });
        }
        res.json({ message: "Record deleted successfully" });
    } catch (err) {
        console.error("Error deleting record:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Function to Parse Form Data
function parseFormData(text) {
    console.log("Extracted Text:", text); // Log the OCR output
    // Normalize text
    text = text.replace(/\r\n|\r|\n/g, " ").trim();

    const name = text.match(/Name :\s*(.+?)(?=\s*():|$)/i)?.[1]?.replace(/\s+/g, " ").trim() || "N/A";
    console.log("Extracted Name:", name); // Debug the extracted name
    const dob = text.match(/Date of Birth:\s*(\d{2}\/\d{2}\/\d{4})/)?.[1]?.trim() || null;
    const gender = text.match(/Gender:\s*(Male|Female|Other)/i)?.[1]?.trim() || "N/A";
    const mobile = text.match(/Mobile:\s*(\d{10})/)?.[1]?.trim() || null;
    const email = text.match(/Email ID:\s*([\w.\-]+@[\w\-]+\.[\w.]+)/)?.[1]?.trim() || "N/A";

    const emergencyContact = {
        name: text.match(/Name of Emergency Contact:\s*(.+?)(?=\s*Emergency Contact's Number:|$)/)?.[1]?.trim() || "N/A",
        number: text.match(/Emergency Contact's Number:\s*(\d+)/)?.[1]?.trim() || null,
    };

    const address = {
        permanent: {
            street: text.match(/3\.1 Street Address:\s*(.*?)(?=\s*3\.2|$)/)?.[1]?.trim() || "N/A",
            city: text.match(/3\.2 City:\s*(.*?)(?=\s*3\.3|$)/)?.[1]?.trim() || "N/A",
            state: text.match(/3\.3 State:\s*(.*?)(?=\s*3\.4|$)/)?.[1]?.trim() || "N/A",
            zip: text.match(/3\.4 Zip Code:\s*(.*?)(?=\s*3\.5|$)/)?.[1]?.trim() || "N/A",
            country: text.match(/3\.5 Country:\s*(.*)/)?.[1]?.trim() || "N/A",
        },
    };

    return { name, dob, gender, mobile, email, emergencyContact, address };
}



// Preprocess Image
async function preprocessImage(filePath) {
    const processedPath = filePath.replace(path.extname(filePath), "_processed.png");
    await sharp(filePath).grayscale().normalize().toFile(processedPath);
    return processedPath;
}

// Extract Text from Image
async function extractTextFromImage(filePath) {
    const { data: { text } } = await Tesseract.recognize(filePath, "eng");
    return text;
}
