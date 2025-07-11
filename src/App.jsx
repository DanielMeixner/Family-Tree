import React, { useState } from "react";
import Papa from "papaparse";
import FamilyTree from "./FamilyTree";

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
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Family Tree App</h1>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {familyData.length > 0 && <FamilyTree data={familyData} />}
      <div style={{ marginTop: 32 }}>
        <h3>CSV Format</h3>
        <pre>Name, Familyname, gender (m,f,o), dob, dod, id, parent1-id, parent2-id</pre>
      </div>
    </div>
  );
}
