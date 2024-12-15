import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
const RecordInside = () => {
    const { id } = useParams(); 
    const [record, setRecord] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/recordInside/${id}`)
            .then(res => setRecord(res.data))
            .catch(err => console.error("Error fetching record details:", err));
    }, [id]);

    return (
        <div>
            {record ? (
                <div className="recordInside">
                    <h2>{record.name}</h2>
                    <p>Email: {record.email}</p>
                    <p>Age: {record.age}</p>
                    <p>Gender: {record.gender}</p>
                    <p>Passport: {record.passport}</p>
                    <p>Mobile: {record.mobile}</p>
                    <p>Pan: {record.pan}</p>
                    <p>Visa: {record.visa}</p>
                    <p>Emergency Contact: {record.emergencyContact.number}</p>
                    <p>Relocation Availability: {record.relocationAvailability}</p>
                    
                </div>
            ) : (
                <p>Loading record details...</p>
            )}
        </div>
    );
};

export default RecordInside;
