import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import bin from '../images/bin.png'

const RecordList = () => {
    const [records, setRecords] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:5000/records?name=${query}`)
            .then(res => {
                console.log(res.data);
                setRecords(res.data);
            })
            .catch(err => console.error("Error fetching records:", err));
    }, [query]);

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/records/${id}`)
            .then(() => {
                setRecords(records.filter(record => record._id !== id));
            })
            .catch(err => console.error("Error deleting record:", err));
    };

    return (
        <div className="record">
            <h2>Records</h2>
            <input
                type="text"
                placeholder="Search by name"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <ul>
                {records.length > 0 ? (
                    records.map(record => (
                        <li key={record._id}>
                            <Link to={`/recordInside/${record._id}`}>
                                {record.name}
                            </Link> - {record.email}
                            
                                <img onClick={() => handleDelete(record._id)} src={bin} className="bin" />
                            
                        </li>
                    ))
                ) : (
                    <li>No records found</li>
                )}
            </ul>
        </div>
    );
};

export default RecordList;
