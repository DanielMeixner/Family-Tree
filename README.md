# Family Tree App

This is a single page application (SPA) that allows you to upload a CSV file containing family data and visualizes the family tree in your browser with enhanced visual features. No server-side dependencies are required.

## Live Demo

[View the Family Tree App on GitHub Pages](https://danielmeixner.github.io/Family-Tree/)

## Features

- **Upload CSV files** with family data
- **Interactive family tree visualization** with zoom, pan, and navigation controls
- **Enhanced visual styling** with rich node details and colored relationships
- **Gender-based styling** with colored borders and relationship paths
- **Deceased indicators** with visual markers and banners
- **Date display** with birth and death dates using intuitive icons
- **Accessibility options** including colorblind-friendly palettes
- **Customizable appearance** with settings panel for personalization
- **No backend/server required** - runs fully in your browser

## Enhanced Visual Features

### Node Styling
- **Gender-based borders**: Blue for male, pink for female, gray for neutral/unknown
- **Person images**: Circular placeholders with initials or uploaded images
- **Rich information display**: Name, birth date (★), death date (✕)
- **Deceased indicators**: Black "DECEASED" banner and border for deceased persons

### Relationship Paths
- **Father-child relationships**: Blue connecting lines
- **Mother-child relationships**: Pink connecting lines
- **Neutral relationships**: Gray connecting lines for unknown gender

### Accessibility & Customization
- **Colorblind-friendly palettes**: Multiple color schemes available
- **Customizable settings**: Toggle icons, banners, and visual elements
- **Responsive design**: Works on desktop and mobile devices
- **Interactive controls**: Zoom, pan, minimap, and fit-to-view options

## CSV Format

Each line in the CSV should have the following columns:

```
Name, Familyname, gender (m,f,o), dob, dod, id, parent1-id, parent2-id
```

### Field Descriptions:
- **Name**: First name of the person
- **Familyname**: Last name of the person
- **gender**: Gender identifier (m = male, f = female, o = other/unknown)
- **dob**: Date of birth (YYYY-MM-DD format)
- **dod**: Date of death (YYYY-MM-DD format, leave empty if alive)
- **id**: Unique identifier for the person
- **parent1-id**: ID of first parent (usually father)
- **parent2-id**: ID of second parent (usually mother)

### Example:
```
John,Doe,m,1950-01-01,2020-01-01,1,,
Jane,Doe,f,1955-01-01,,2,,
Alice,Doe,f,1980-01-01,,3,1,2
Bob,Doe,m,1982-05-10,,4,1,2
Carol,Smith,f,1978-03-15,,5,,
David,Smith,m,2000-07-20,,6,4,5
```

## How to Run Locally

1. **Install dependencies** (only needed once):
   ```sh
   npm install
   ```

2. **Start the development server:**
   ```sh
   npm start
   ```

3. **Open your browser** and go to [http://localhost:3000](http://localhost:3000) or the URL shown in the terminal.

4. **Upload your CSV file** and view the enhanced family tree visualization.

## How to Use

1. **Upload CSV File**: Click "Choose File" and select your family data CSV file
2. **Explore the Tree**: Use zoom controls, pan by dragging, and navigate with the minimap
3. **Customize Appearance**: Click the ⚙️ Settings button to access accessibility options:
   - Choose colorblind-friendly palettes
   - Toggle birth/death icons
   - Adjust font sizes
   - Change edge styles
   - Show/hide deceased banners
4. **Interactive Features**: Click nodes to focus, use controls to zoom and fit view

## Technical Details

This project uses:
- **React** for the user interface
- **ReactFlow** for interactive graph visualization
- **Dagre** for automatic graph layout
- **PapaParse** for CSV parsing
- **Vite** for development and building

## Browser Support

Works in all modern browsers including Chrome, Firefox, Safari, and Edge.

---

*Enhanced with colored relationship paths, gender-based styling, deceased indicators, and accessibility features.*

