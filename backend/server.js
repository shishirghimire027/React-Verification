const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/verify", (req, res) => {
  const { code } = req.body; // This line extract the code from the request body
  console.log(code);

  // Server validation
  if (!/^\d{6}$/.test(code) || code[5] === "7") {
    // Check if the code is 6 digits and does not end in 7
    return res.status(400).json({ error: "Verification Error" });
  }

  res.status(200).json({ message: "Verification Success" });
});

app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
