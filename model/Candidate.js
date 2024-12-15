const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CandidateSchema = new mongoose.Schema({
    name: String,
    permanentAddress: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
    },
    currentAddress: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
    },
    age: Number,
    gender: String,
    passport: String,
    mobile: String,
    pan: String,
    visa: String,
    email: String,
    emergencyContact: {
        name: String,
        number: String,
    },
    relocationAvailability: String,
    formPath: String, 
}, { timestamps: true });

module.exports = mongoose.model("Candidate", CandidateSchema);


