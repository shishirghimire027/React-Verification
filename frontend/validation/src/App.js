import React, { useState } from "react";
import "./App.css";

function App() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^\d$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (index < 5) {
        document.getElementById(`code-input-${index + 1}`).focus();
      }
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("Text");
    if (/^\d{6}$/.test(pasteData)) {
      setCode(pasteData.split(""));
    }
  };

  const handleSubmit = async () => {
    if (code.includes("")) {
      setError("Please fill in all fields.");
      console.log("Verification Error: Please fill in all fields. ")
      setCode(['', '', '', '', '', '']);
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.join("") }),
      });

      if (response.ok) {
        
        alert("Verification Success!")
        window.location.href = "/success";
      } else {
        const data = await response.json();
        setCode(['', '', '', '', '', '']); //This line clears the field incase of error
        setError(data.error || "Verification Error");
        document.getElementById('code-input-0').focus();
        
      }
    } catch (err) {
      setError("Server error, please try again later.");
      setCode(['', '', '', '', '', '']);
      document.getElementById('code-input-0').focus();
    }
  };
  return (
    <div className="verApp" style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Enter the 6-digit code</h2>
      <div
        className="inputs"
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        {code.map((digit, index) => (
          <input
            key={index}
            id={`code-input-${index}`}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onPaste={index === 0 ? handlePaste : null}
            className={digit === "" ? "error" : ""}
            style={{
              width: "30px",
              height: "30px",
              fontSize: "20px",
              textAlign: "center",
              marginLeft: "5px",
              border: "2px solid #ccc",
              borderRadius: "5px",
            }}
          />
        ))}
      </div>
      {error && <p className="error-message">{error}</p>}
      <button className="btn btn-dark" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}

export default App;
