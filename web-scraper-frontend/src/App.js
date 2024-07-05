import "./App.css";
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/fetch-info", {
        url,
      });
      setData(formatContent(response.data.content));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatContent = (content) => {
    const lines = content.split("\n");
    let formattedContent = "";
    let inList = false;

    lines.forEach((line) => {
      line = line.trim();
      if (line.startsWith("- ")) {
        if (!inList) {
          formattedContent +=
            '<ul style="list-style-type: disc; padding-left: 40px; margin: 0;">';
          inList = true;
        }
        formattedContent += `<li style="margin-bottom: 5px;">${line.substring(
          2
        )}</li>`;
      } else {
        if (inList) {
          formattedContent += "</ul>";
          inList = false;
        }
        if (line) {
          formattedContent += `<p style="margin-bottom: 10px; font-size: 16px;"><strong>${line}</strong></p>`;
        }
      }
    });

    if (inList) {
      formattedContent += "</ul>";
    }

    return formattedContent;
  };

  return (
    <div className="App">
      <header className="App-header" style={{ backgroundColor: "#1b1a1c" }}>
        <div
          className="container"
          style={{ padding: "20px", maxWidth: "800px" }}
        >
          <h1
            style={{
              color: "#FFFFFF",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            Interview Assistant AI
          </h1>
          <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL"
              required
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #ddd",
                marginRight: "10px",
                width: "60%",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#950dde",
                color: "white",
                cursor: "pointer",
                width: "30%",
              }}
              disabled={loading}
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </form>
          {data && (
            <div
              className="result-container"
              style={{
                backgroundColor: "#f0f0f0",
                padding: "20px",
                borderRadius: "5px",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                fontSize: "16px",
                lineHeight: "1.6",
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: data }} />
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
