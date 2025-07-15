import React from "react";
import { Handle, Position } from "reactflow";

const CustomNode = ({ data, settings = {} }) => {
  const { name, familyname, gender, dob, dod, image } = data;
  
  // Use settings with fallback to defaults
  const {
    colors = {
      male: '#2196F3',
      female: '#E91E63',
      neutral: '#9E9E9E'
    },
    showDeathIcons = true,
    showBirthIcons = true,
    showDeceasedBanner = true,
    fontSize = 14
  } = settings;
  
  // Helper function to determine if person is deceased
  const isDeceased = dod && dod.trim() !== "";
  
  // Helper function to get gender colors
  const getGenderColor = (gender) => {
    switch (gender?.toLowerCase()) {
      case 'm':
        return colors.male;
      case 'f':
        return colors.female;
      default:
        return colors.neutral;
    }
  };
  
  // Helper function to format dates
  const formatDate = (dateStr) => {
    if (!dateStr || dateStr.trim() === '') return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const borderColor = getGenderColor(gender);
  const fullName = `${name} ${familyname}`;
  
  return (
    <div style={{
      background: '#fff',
      border: `3px solid ${borderColor}`,
      borderRadius: '12px',
      padding: '12px',
      minWidth: '180px',
      maxWidth: '220px',
      textAlign: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      position: 'relative',
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      fontSize: `${fontSize}px`
    }}>
      {/* Deceased banner */}
      {isDeceased && showDeceasedBanner && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          background: '#000',
          color: '#fff',
          fontSize: `${fontSize - 4}px`,
          padding: '2px 6px',
          borderRadius: '9px 9px 0 0',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          DECEASED
        </div>
      )}
      
      {/* Image placeholder */}
      <div style={{
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: image ? `url(${image})` : '#f0f0f0',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        margin: `${isDeceased && showDeceasedBanner ? '16px' : '0px'} auto 8px auto`,
        border: isDeceased && showDeceasedBanner ? '2px solid #000' : '2px solid #ddd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666',
        fontSize: `${fontSize - 2}px`,
        fontWeight: 'bold'
      }}>
        {!image && (name ? name.charAt(0) + (familyname ? familyname.charAt(0) : '') : '?')}
      </div>
      
      {/* Name */}
      <div style={{
        fontWeight: 'bold',
        fontSize: `${fontSize}px`,
        color: '#333',
        marginBottom: '4px',
        lineHeight: '1.2'
      }}>
        {fullName}
      </div>
      
      {/* Date of birth */}
      {dob && (
        <div style={{
          fontSize: `${fontSize - 3}px`,
          color: '#666',
          marginBottom: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px'
        }}>
          {showBirthIcons && <span style={{ color: '#FFD700' }}>★</span>}
          {formatDate(dob)}
        </div>
      )}
      
      {/* Date of death */}
      {isDeceased && (
        <div style={{
          fontSize: `${fontSize - 3}px`,
          color: '#666',
          marginBottom: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px'
        }}>
          {showDeathIcons && <span style={{ color: '#666' }}>✕</span>}
          {formatDate(dod)}
        </div>
      )}
      
      {/* ReactFlow handles */}
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ 
          background: borderColor,
          width: '8px',
          height: '8px',
          border: '2px solid #fff'
        }} 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ 
          background: borderColor,
          width: '8px',
          height: '8px',
          border: '2px solid #fff'
        }} 
      />
    </div>
  );
};

export default CustomNode;