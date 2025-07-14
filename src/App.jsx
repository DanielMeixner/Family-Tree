import React, { useState } from "react";
import Papa from "papaparse";
import Family-Tree from "./Family-Tree";


const cardStyle = {
  width: "100vw",
  maxWidth: "100vw",
  background: "#fff",
  borderRadius: 0,
  boxShadow: "0 2px 12px 0 rgba(60,60,60,0.08)",
  padding: "18px 0 10px 0",
  borderBottom: "1.5px solid #e5e5e7",
  zIndex: 10,
  position: "fixed",
  top: 0,
  left: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};
const headingStyle = {
  fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  fontWeight: 800,
  fontSize: 28,
  letterSpacing: -0.5,
  color: "#222",
  marginBottom: 2,
  textAlign: "center",
};
const subheadingStyle = {
  color: "#555",
  fontWeight: 400,
  fontSize: 15,
  textAlign: "center",
  marginBottom: 18,
  letterSpacing: '0.2px',
  fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
};
const inputStyle = {
  display: "block",
  margin: "0 auto 0 auto",
  padding: "10px 18px",
  borderRadius: 8,
  border: "1.5px solid #bbb",
  background: "#f7f7f7",
  fontSize: 16,
  fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  outline: "none",
  boxShadow: "0 1px 2px 0 #e0e0e0",
  transition: "border 0.2s, box-shadow 0.2s",
};
const errorStyle = {
  color: "#b00020",
  background: "#fff0f0",
  borderRadius: 8,
  padding: "10px 18px",
  margin: "0 auto 18px auto",
  maxWidth: 400,
  textAlign: "center",
  fontWeight: 500,
  border: "1.5px solid #ffd6d6",
};
const infoStyle = {
  marginTop: 16,
  background: "#f7f7f7",
  borderRadius: 8,
  padding: 10,
  color: "#222",
  fontSize: 13,
  border: "1px solid #e5e5e7",
  boxShadow: "0 1px 4px 0 #e0e0e0",
};
const preStyle = {
  background: "#f0f0f0",
  borderRadius: 6,
  padding: 10,
  fontSize: 13,
  margin: 0,
  color: "#333",
  fontFamily: "Menlo, Monaco, 'Fira Mono', 'Consolas', monospace",
};

export default function App() {
  const [familyData, setFamilyData] = useState([]);
  const [error, setError] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsed = results.data.map((row) => ({
            name: row[0],
            familyname: row[1],
            gender: row[2],
            dob: row[3],
            dod: row[4],
            id: row[5],
            parent1: row[6],
            parent2: row[7],
          }));
          setFamilyData(parsed);
          setError("");
        } catch (err) {
          setError("Failed to parse CSV");
        }
      },
      error: () => setError("Failed to read file"),
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        background: "#f4f6fa",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 0,
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <div style={cardStyle}>
        <div style={headingStyle}>Family Tree App</div>
        <div style={subheadingStyle}>Upload a CSV file to visualize your family tree</div>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          style={inputStyle}
        />
        {error && <div style={errorStyle}>{error}</div>}
        <div style={infoStyle}>
          <h3 style={{ margin: "0 0 8px 0", fontWeight: 600, fontSize: 14, color: "#222" }}>CSV Format</h3>
          <pre style={preStyle}>Name, Familyname, gender (m,f,o), dob, dod, id, parent1-id, parent2-id</pre>
        </div>
      </div>
      <div style={{ flex: 1, width: "100vw", height: "100vh", marginTop: 80, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {familyData.length > 0 && (
          <div style={{ width: "90vw", height: "80vh", borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 16px 0 rgba(60,60,60,0.08)", background: "#fff", pointerEvents: "auto", border: "1px solid #e5e5e7" }}>
            <Family-Tree data={familyData} />
          </div>
        )}
      </div>
    </div>
  );
}
