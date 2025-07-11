# Family Tree App

This is a single page application (SPA) that allows you to upload a CSV file containing family data and visualizes the family tree in your browser. No server-side dependencies are required.

## Features
- Upload a CSV file with family data
- Visualize the family tree interactively
- No backend/server required (runs fully in your browser)

## CSV Format
Each line in the CSV should have the following columns:

```
Name, Familyname, gender (m,f,o), dob, dod, id, parent1-id, parent2-id
```

Example:
```
John,Doe,m,1950-01-01,2020-01-01,1,,
Jane,Doe,f,1955-01-01,,2,,
Alice,Doe,f,1980-01-01,,3,1,2
```

## How to Run

1. **Install dependencies** (only needed once):
   ```sh
   npm install
   ```
2. **Start the app locally:**
   ```sh
   npm start
   ```
3. Open your browser and go to [http://localhost:3000](http://localhost:3000) or the URL shown in the terminal.

4. Upload your CSV file and view the family tree.

---

This project uses React, D3.js for visualization, and PapaParse for CSV parsing.

