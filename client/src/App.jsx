import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RecordList from "./components/RecordList";
import RecordInside from "./pages/RecordInside";
import UploadForm from "./components/UploadForm";
import './App.css'

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UploadForm/>}
                />
                {/* <Route path="/" element={<RecordList />} /> */}
                <Route path="/recordInside/:id" element={<RecordInside />} />
            </Routes>
        </Router>
    );
};

export default App;
