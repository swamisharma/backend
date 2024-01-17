const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Signup API route
app.post("/signup", (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  // Read the existing users from the JSON file
  const users = JSON.parse(fs.readFileSync("users.json", "utf-8"));

  // Check if the username already exists
  if (users.find((user) => user.name === name)) {
    return res.status(400).json({ error: "Username already exists" });
  }

  // Add the new user to the array
  users.push({ name, password, id: users.length + 1 });

  // Write the updated users array back to the JSON file
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

  res.status(200).json({ message: "User created successfully" });
});

// Login API route
app.post("/login", (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  // Read the existing users from the JSON file
  const users = JSON.parse(fs.readFileSync("users.json", "utf-8"));

  // Check if the entered credentials are valid
  const isValidUser = users.some(
    (user) => user.name === name && user.password === password
  );

  if (isValidUser) {
    res.status(200).json({ message: "Login successful" });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Fetch Users data route
app.get("/", (req, res) => {
  // Read the existing users from the JSON file
  const users = JSON.parse(fs.readFileSync("users.json", "utf-8"));

  res.status(200).json({ data: users });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
