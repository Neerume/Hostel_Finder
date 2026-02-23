const express = require("express");    //express helps to create backend apis easily.
const cors = require("cors");      //to allow front end to talk to backend
 
const app = express();     //call
const db = require("./dbConnection");

//Middleware
app.use(cors());
app.use(express.json());   //allows backend to read front end data


//Initial route
app.get("/", (req, res)=>{
  res.send("Backend is runninggg");
});

// POST /register 
app.post('/register', (req, res) => {
  const { fullName, email, phoneNumber, password } = req.body;

  if (!fullName || !email || !phoneNumber || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Password
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character'
    });
  }

  const sql = "INSERT INTO users (fullName, email, phoneNumber, password) VALUES (?, ?, ?, ?)";

db.query(sql, [fullName, email, phoneNumber, password], (err, result) => {
  if (err) {
    console.error("Database error:", err);
    return res.status(500).json({ message: "Database error" });
  }

  res.status(200).json({ message: "User registered successfully!" });
});
  
});


//Start Server
app.listen(5000, ()=>{     //if we dotn write this server never starts
  console.log("Server is running on port 5000");
});
