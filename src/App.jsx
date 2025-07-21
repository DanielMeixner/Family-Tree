import React, { useState } from "react";
import Papa from "papaparse";
import FamilyTree from "./FamilyTree";
import SettingsPanel from "./SettingsPanel";

// Default family data - 20-person family tree
const defaultFamilyData = [
  { name: "Robert", familyname: "Johnson", gender: "m", dob: "1925-03-15", dod: "2010-08-20", id: "1", parent1: "", parent2: "" },
  { name: "Mary", familyname: "Wilson", gender: "f", dob: "1928-07-22", dod: "2015-12-10", id: "2", parent1: "", parent2: "" },
  { name: "James", familyname: "Johnson", gender: "m", dob: "1950-05-10", dod: "", id: "3", parent1: "1", parent2: "2" },
  { name: "Susan", familyname: "Davis", gender: "f", dob: "1952-09-18", dod: "", id: "4", parent1: "", parent2: "" },
  { name: "Linda", familyname: "Johnson", gender: "f", dob: "1953-01-30", dod: "", id: "5", parent1: "1", parent2: "2" },
  { name: "Michael", familyname: "Brown", gender: "m", dob: "1951-11-05", dod: "", id: "6", parent1: "", parent2: "" },
  { name: "David", familyname: "Johnson", gender: "m", dob: "1955-04-12", dod: "", id: "7", parent1: "1", parent2: "2" },
  { name: "Patricia", familyname: "Miller", gender: "f", dob: "1957-08-25", dod: "", id: "8", parent1: "", parent2: "" },
  { name: "Jennifer", familyname: "Johnson", gender: "f", dob: "1975-03-08", dod: "", id: "9", parent1: "3", parent2: "4" },
  { name: "Christopher", familyname: "Johnson", gender: "m", dob: "1977-06-14", dod: "", id: "10", parent1: "3", parent2: "4" },
  { name: "Matthew", familyname: "Brown", gender: "m", dob: "1978-02-20", dod: "", id: "11", parent1: "5", parent2: "6" },
  { name: "Amanda", familyname: "Brown", gender: "f", dob: "1980-10-03", dod: "", id: "12", parent1: "5", parent2: "6" },
  { name: "Joshua", familyname: "Johnson", gender: "m", dob: "1982-12-17", dod: "", id: "13", parent1: "7", parent2: "8" },
  { name: "Sarah", familyname: "Johnson", gender: "f", dob: "1985-04-30", dod: "", id: "14", parent1: "7", parent2: "8" },
  { name: "Emily", familyname: "Johnson", gender: "f", dob: "2000-07-22", dod: "", id: "15", parent1: "9", parent2: "", },
  { name: "Daniel", familyname: "Johnson", gender: "m", dob: "2002-11-15", dod: "", id: "16", parent1: "10", parent2: "" },
  { name: "Sophia", familyname: "Brown", gender: "f", dob: "2005-01-08", dod: "", id: "17", parent1: "11", parent2: "" },
  { name: "Alexander", familyname: "Brown", gender: "m", dob: "2007-05-12", dod: "", id: "18", parent1: "12", parent2: "" },
  { name: "Olivia", familyname: "Johnson", gender: "f", dob: "2010-09-03", dod: "", id: "19", parent1: "13", parent2: "" },
  { name: "Lucas", familyname: "Johnson", gender: "m", dob: "2012-03-25", dod: "", id: "20", parent1: "14", parent2: "" }
];


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
  const [familyData, setFamilyData] = useState(defaultFamilyData);
  const [error, setError] = useState("");
  const [isControlsOpen, setIsControlsOpen] = useState(true);
  const [settings, setSettings] = useState({
    colorPalette: 'default',
    colors: {
      male: '#2196F3',
      female: '#E91E63',
      neutral: '#9E9E9E'
    },
    showDeathIcons: true,
    showBirthIcons: true,
    showDeceasedBanner: true,
    fontSize: 14,
    edgeStyle: 'simplebezier',
    curveIntensity: 1.5
  });

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
        fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      {/* Full-page family tree */}
      <div style={{ width: "100vw", height: "100vh" }}>
        <FamilyTree data={familyData} settings={settings} />
      </div>

      {/* Control overlay */}
      <div
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          zIndex: 100,
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          maxWidth: "350px",
          transition: "all 0.3s ease"
        }}
      >
        {/* Header with toggle button */}
        <div
          style={{
            padding: "12px 16px",
            borderBottom: isControlsOpen ? "1px solid #e5e5e7" : "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer"
          }}
          onClick={() => setIsControlsOpen(!isControlsOpen)}
        >
          <div style={{ fontWeight: 600, fontSize: 16, color: "#222" }}>
            Family Tree Controls
          </div>
          <div style={{ 
            fontSize: 18, 
            color: "#666",
            transform: isControlsOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease"
          }}>
            ▼
          </div>
        </div>

        {/* Collapsible content */}
        {isControlsOpen && (
          <div style={{ padding: "16px" }}>
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#222", marginBottom: "8px" }}>
                Load Custom Family Tree
              </div>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1.5px solid #ddd",
                  background: "#f9f9f9",
                  fontSize: 14,
                  outline: "none"
                }}
              />
              {error && (
                <div style={{
                  color: "#b00020",
                  background: "#fff0f0",
                  borderRadius: 6,
                  padding: "8px 12px",
                  marginTop: "8px",
                  fontSize: 13,
                  border: "1px solid #ffd6d6"
                }}>
                  {error}
                </div>
              )}
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#222", marginBottom: "8px" }}>
                CSV Format
              </div>
              <div style={{
                background: "#f7f7f7",
                borderRadius: 6,
                padding: "8px 12px",
                fontSize: 12,
                fontFamily: "Monaco, 'Fira Mono', 'Consolas', monospace",
                color: "#666",
                border: "1px solid #e5e5e7"
              }}>
                Name, Familyname, gender (m,f,o), dob, dod, id, parent1-id, parent2-id
              </div>
            </div>

            <div style={{ marginBottom: "8px" }}>
              <button
                onClick={() => setFamilyData(defaultFamilyData)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "background 0.2s ease"
                }}
                onMouseOver={(e) => e.target.style.background = "#1976D2"}
                onMouseOut={(e) => e.target.style.background = "#2196F3"}
              >
                Reset to Default Family Tree
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Settings panel */}
      <div style={{ position: "fixed", top: 20, right: 20, zIndex: 100 }}>
        <SettingsPanel settings={settings} onSettingsChange={setSettings} />
      </div>
    </div>
  );
}
