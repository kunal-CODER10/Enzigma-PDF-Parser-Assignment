import React, { useState } from "react";
import axios from "axios";
import RecordList from "./RecordList";
import { useDropzone } from "react-dropzone";
import { AiOutlineCloudUpload, AiOutlineCheckCircle } from "react-icons/ai";
import "../dragdrop.css";
import cloudLogo from '../images/cloudLogo.png'

const UploadForm = () => {
    const [files, setFiles] = useState([]);
    const [message, setMessage] = useState("");
    const [results, setResults] = useState(null);

    // Handle files dropped into the dropzone
    const onDrop = (acceptedFiles) => {
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
        accept: "application/pdf, image/*",
    });

    const handleUpload = async () => {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        try {
            const res = await axios.post("http://localhost:5000/upload", formData);
            setResults(res.data);
            setMessage("Files uploaded successfully!");
            setFiles([]); // Clear the file list after upload
        } catch (err) {
            setMessage("Error uploading files");
        }
    };

    const handleRemoveFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };
    <style>
@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Zen+Dots&display=swap');
</style>

    return (
        <div className="landing">
            <div className="upload">
            <div className="heading">
            <h1>KUNAL <br/> <p className="stepdown">SURYAWANSHI</p></h1>
            <div className="headingLine"></div>
        </div>
        <img  src={cloudLogo} className="cloudLogo"/>

                <h2>Drag and Drop Upload Form</h2>
                <div {...getRootProps({ className: "dropzone" })}>
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p>Drop the files here...</p>
                    ) : (
                        <p>
                            <AiOutlineCloudUpload size={30} />
                            Drag & drop files here, or click to select files
                        </p>
                    )}
                </div>
                <ul className="file-list">
                    {files.map((file, index) => (
                        <li key={index} className="file-item">
                            <span>{file.name}</span>
                            <button
                                onClick={() => handleRemoveFile(index)}
                                className="remove-file-btn"
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
                <button className="uploadButton" onClick={handleUpload} disabled={!files.length}>
                    Upload
                </button>
                {message && <p>{message}</p>}
                <div className="fileOnboardingDashboard">
                    <p>A FILE ONBOARDING DASHBOARD.</p>
                </div>
            </div>
            <div className="rightPart">
                <RecordList />
                <div className="allowsTeam">
                <p>ALLOWS TEAM TO UPLOAD
                    AND MANAGE
                    FILES.</p>
            </div>
            </div>
        </div>
    );
};

export default UploadForm;
