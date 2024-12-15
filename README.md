# Onboarding System

An automated onboarding system that streamlines the process of handling candidate data by extracting information from scanned forms (images or PDFs) and managing records via a user-friendly interface.

---

## Features

- **File Upload**:
  - Supports drag-and-drop or file selection for uploading scanned forms (images or PDFs).
  - Preprocesses images to improve text extraction accuracy.

- **OCR (Optical Character Recognition)**:
  - Extracts relevant details (e.g., Name, Date of Birth, Email) from uploaded forms using Tesseract.js.

- **Database Management**:
  - Stores extracted data in a MongoDB database.
  - Supports viewing, searching, and deleting records.

- **REST API**:
  - Backend routes for uploading files, fetching records, and deleting specific entries.

---

## Tech Stack

### **Frontend**
- React.js
- Axios
- React Router DOM

### **Backend**
- Node.js
- Express.js
- Multer for file uploads
- Tesseract.js for OCR
- Sharp for image preprocessing

### **Database**
- MongoDB with Mongoose ODM

---

## Installation and Setup

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd onboarding-system
   ```

2. **Install Dependencies**:
   - For Backend:
     ```bash
     
     npm install
     ```
   - For Frontend:
     ```bash
     cd client
     npm install
     ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the `root` directory with the following:
   ```plaintext
   MONGO_URI=<your-mongodb-connection-string>
   PORT=5000
   ```

4. **Run the Application**:
   - Start the Backend:
     ```bash
     
     nodemon server.js
     ```
   - Start the Frontend:
     ```bash
     cd client
     npm run dev
     ```

5. **Access the Application**:
   Open your browser and go to:
   ```
   http://localhost:3000
   ```

---

---

## API Endpoints

### **Upload Files**
- **POST** `/upload`
  - Uploads image or PDF files and extracts text using OCR.

### **Get All Records**
- **GET** `/records`
  - Fetches all records, with optional search by name.

### **Get Record by ID**
- **GET** `/recordInside/:id`
  - Fetches details of a specific record by its ID.

### **Delete Record by ID**
- **DELETE** `/records/:id`
  - Deletes a specific record by its ID.

---


## Acknowledgements

- [Tesseract.js](https://github.com/naptha/tesseract.js): OCR Library
- [React.js](https://reactjs.org/): Frontend Framework
- [MongoDB](https://www.mongodb.com/): Database
- [Express.js](https://expressjs.com/): Backend Framework

---

## Contact

For questions or support, contact:
- **Name**: Kunal Suryawanshi
- **Email**: kunalsurya16102003@gmail.com
